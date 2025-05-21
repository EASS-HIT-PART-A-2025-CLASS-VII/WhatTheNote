from fastapi import APIRouter, Depends, HTTPException, Body, UploadFile, File, status
from typing import List
from datetime import datetime
from zoneinfo import ZoneInfo
import json
import httpx
import logging
import pdfplumber
from io import BytesIO

logger = logging.getLogger(__name__)

from app.schemas.query_schemas import QueryRequest
from app.schemas.document_schemas import DocumentWithDetails
from app.schemas.user_schemas import User
from app.services.auth import get_current_user
from app.services.db import (
    get_user_documents,
    get_document,
    add_query_to_document,
    add_document_to_user,
    get_next_document_id,
    delete_document,
    update_document_last_viewed,
)
from app.core.prompts import QUERY_PROMPT, UPLOAD_PROMPT
from app.core.utils import get_ollama_url, clean_text_with_llm
from app.services.auth import get_current_user

router = APIRouter()


@router.get("/documents", response_model=List[DocumentWithDetails])
async def get_documents(current_user: User = Depends(get_current_user)):
    documents = await get_user_documents(current_user.id)
    return documents


@router.get("/dashboard")
async def get_documents_dashboard(
    subject: str = "All Subjects", current_user: User = Depends(get_current_user)
):
    documents = await get_user_documents(current_user.id, subject)
    return documents


@router.get("/documents/{document_id}")
async def get_single_document(
    document_id: int, current_user: User = Depends(get_current_user)
):
    document = await get_document(current_user.id, document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    await update_document_last_viewed(current_user.id, document_id)
    return document


@router.delete("/documents/{document_id}")
async def delete_a_document(
    document_id: int, current_user: User = Depends(get_current_user)
):
    result = await delete_document(current_user.id, document_id)
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Document not found")
    return {"message": "Document deleted successfully"}


@router.post("/documents/{document_id}/query")
async def query_document(
    document_id: int,
    query: QueryRequest,
    current_user: User = Depends(get_current_user),
):
    doc = await get_document(current_user.id, document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    prompt = QUERY_PROMPT.format(content=doc["content"], question=query.question)

    ollama_url = get_ollama_url()

    try:
        async with httpx.AsyncClient(timeout=300) as client:
            response = await client.post(
                ollama_url,
                json={"model": "gemma2:2b", "prompt": prompt, "stream": False},
            )
            response.raise_for_status()
            llm_response = response.json()
            logger.info(f"Ollama response: {llm_response}")

        query_data = {
            "question": query.question,
            "answer": llm_response.get("response").strip(),
            "timestamp": datetime.now(ZoneInfo("Asia/Jerusalem")),
        }
        result = await add_query_to_document(current_user.id, document_id, query_data)
        if not result.modified_count:
            raise HTTPException(
                status_code=500, detail="Failed to save query to database"
            )

        return query_data

    except httpx.ConnectError as e:
        logger.error(f"Ollama connection error: {str(e)}")
        raise HTTPException(status_code=503, detail="Ollama service unavailable")
    except httpx.TimeoutException as e:
        logger.error(f"Ollama timeout: {str(e)}")
        raise HTTPException(status_code=504, detail="Ollama request timeout")
    except httpx.HTTPStatusError as e:
        logger.error(f"Ollama API error: {str(e)} Response: {e.response.text}")
        raise HTTPException(
            status_code=502, detail=f"Ollama API error: {e.response.status_code}"
        )
    except (KeyError, json.JSONDecodeError) as e:
        logger.error(f"Response parsing error: {str(e)}")
        raise HTTPException(status_code=502, detail="Invalid Ollama response format")
    except Exception as e:
        logger.exception("Unexpected error during query processing")
        raise HTTPException(
            status_code=500, detail=f"Query processing failed: {str(e)}"
        )


@router.post("/documents/upload")
async def upload_document(
    file: UploadFile = File(...), current_user: User = Depends(get_current_user)
):
    if not file.content_type == "application/pdf" or not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Invalid file type. PDF only.")

    contents = await file.read()
    text = ""
    with pdfplumber.open(BytesIO(contents)) as pdf:
        for page in pdf.pages:
            text += page.extract_text()

    cleaned_text = await clean_text_with_llm(text)

    ollama_url = get_ollama_url()
    prompt = UPLOAD_PROMPT.format(text=cleaned_text)

    try:
        async with httpx.AsyncClient(timeout=300) as client:
            response = await client.post(
                ollama_url,
                json={
                    "model": "gemma2:2b",
                    "prompt": prompt,
                    "format": "json",
                    "stream": False,
                },
            )
            response.raise_for_status()
            response_data = response.json()
        if "response" not in response_data:
            raise ValueError("Missing 'response' field in Ollama output")

        ai_data = json.loads(response_data["response"])
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Document processing failed: {str(e)}"
        )

    document = DocumentWithDetails(
        id=await get_next_document_id(),
        title=ai_data["title"],
        subject=ai_data.get("subject", "General"),
        content=cleaned_text,
        summary=ai_data["summary"],
        uploadedDate=datetime.now(ZoneInfo("Asia/Jerusalem")),
        lastViewed=None,
    )

    await add_document_to_user(current_user.id, document.model_dump())
    return document
