from fastapi import APIRouter, Depends, HTTPException, Body, UploadFile, File, status
from typing import List
from datetime import datetime
import os
import requests
import json
import httpx
import fitz
import logging

logger = logging.getLogger(__name__)

from app.schemas import QueryRequest, DocumentWithDetails
from app.auth import get_current_user, User
from app.db import (
    get_user_documents,
    get_document,
    add_query_to_document,
    add_document_to_user,
    get_next_document_id,
    delete_document,
    update_document_last_viewed,
)

router = APIRouter()


@router.get("/documents", response_model=List[DocumentWithDetails])
async def get_documents(current_user: User = Depends(get_current_user)):
    documents = await get_user_documents(current_user.id)
    return documents


@router.get("/dashboard")
async def get_documents_dashboard(subject: str = "All Subjects", current_user: User = Depends(get_current_user)):
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

    prompt = f"""Based on the following document content, answer the user's question. 
                Document Content: {doc['content']} User Question: {query.question}
                Respond with the answer only, make it concised.
                """

    ollama_url = os.getenv("OLLAMA_BASE_URL") + "/api/generate"

    try:
        async with httpx.AsyncClient(timeout=300) as client:
            response = await client.post(
                ollama_url,
                json={
                    "model": "gemma3:1b",
                    "prompt": prompt,
                    "stream": False
                }
            )
            response.raise_for_status()
            llm_response = response.json()
            logger.info(f"Ollama response: {llm_response}")

        query_data = {
            "question": query.question,
            "answer": llm_response.get("response").strip(),
            "timestamp": datetime.utcnow(),
        }
        result = await add_query_to_document(
            current_user.id, document_id, query_data
        )
        if not result.modified_count:
            raise HTTPException(
                status_code=500, detail="Failed to save query to database"
            )

        return {
            "question": query.question,
            "answer": llm_response.get("response").strip(),
            "timestamp": datetime.utcnow(),
        }
    except httpx.ConnectError as e:
        logger.error(f"Ollama connection error: {str(e)}")
        raise HTTPException(status_code=503, detail="Ollama service unavailable")
    except httpx.TimeoutException as e:
        logger.error(f"Ollama timeout: {str(e)}")
        raise HTTPException(status_code=504, detail="Ollama request timeout")
    except httpx.HTTPStatusError as e:
        logger.error(f"Ollama API error: {str(e)} Response: {e.response.text}")
        raise HTTPException(status_code=502, detail=f"Ollama API error: {e.response.status_code}")
    except (KeyError, json.JSONDecodeError) as e:
        logger.error(f"Response parsing error: {str(e)}")
        raise HTTPException(status_code=502, detail="Invalid Ollama response format")
    except Exception as e:
        logger.exception("Unexpected error during query processing")
        raise HTTPException(status_code=500, detail=f"Query processing failed: {str(e)}")


@router.post("/documents/upload")
async def upload_document(
    file: UploadFile = File(...), current_user: User = Depends(get_current_user)
):
    contents = file.file.read()

    text = ""
    try:
        with fitz.open(stream=contents) as doc:  # No filetype param
            text = "\n".join(page.get_text() for page in doc)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid PDF file")

    ollama_url = os.getenv("OLLAMA_BASE_URL") + "/api/generate"

    prompt = f"""
    Analyze the following content:
    -- START OF CONTENT --
    \n{text}\n
    -- END OF CONTENT --
    Return a concise JSON object with the following structure:
    - "title": a brief, meaningful title that's relevant to the whole content (max 5 words)
    - "subject": most relevant keyword, max 2 words
    - "summary": a short summary of what this content is about (max 40 words)
    Respond with **only** valid JSON. No explanations, markdown, or extra text.
    """

    try:
        response = requests.post(
            ollama_url,
            json={
                "model": "gemma3:1b",
                "prompt": prompt,
                "format": "json",
                "stream": False,
            },
        )
        response.raise_for_status()
        response_data = response.json()
        if "response" not in response_data:
            raise ValueError("Missing 'response' field in Ollama output")

        cleaned_response = (
            response_data["response"].replace("```json", "").replace("```", "").strip()
        )
        ai_data = json.loads(cleaned_response)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Document processing failed: {str(e)}"
        )

    document = DocumentWithDetails(
        id=await get_next_document_id(),
        title=ai_data["title"],
        subject=ai_data.get("subject", "General"),
        content=text,
        summary=ai_data["summary"],
        uploadedDate=datetime.now(),
        lastViewed=None,
    )

    await add_document_to_user(current_user.id, document.model_dump())
    return document
