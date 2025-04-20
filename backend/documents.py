from fastapi import APIRouter, Depends, HTTPException, Body, UploadFile, File, status
from typing import List
from datetime import datetime
import os
import json
import requests
import io
from PyPDF2 import PdfReader

from .schemas import QueryRequest, DocumentWithDetails
from .auth import get_current_user, User
from .db import (
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
    if not isinstance(document_id, int):
        raise HTTPException(status_code=400, detail="Document ID must be an integer")

    doc = await get_document(current_user.id, document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    prompt = f"Document: {doc['content']}\n\nQuestion: {query.question}\nAnswer:"

    try:
        import httpx

        async with httpx.AsyncClient() as client:
            response = await client.post(
                os.getenv("OLLAMA_BASE_URL") + "/api/generate",
                json={"model": "llama3.2:latest", "prompt": prompt, "stream": False},
                timeout=30,
            )
            response.raise_for_status()
            llm_response = response.json()

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
    except httpx.RequestError as e:
        raise HTTPException(status_code=503, detail=f"Ollama API unavailable: {str(e)}")
    except (KeyError, json.JSONDecodeError) as e:
        raise HTTPException(
            status_code=502, detail=f"Invalid response format from Ollama: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM query failed: {str(e)}")


@router.post("/documents/upload")
async def upload_document(
    file: UploadFile = File(...), current_user: User = Depends(get_current_user)
):
    contents = file.file.read()

    text = ""
    try:
        pdf = PdfReader(io.BytesIO(contents))
        text = "\n".join([page.extract_text() for page in pdf.pages])
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid PDF file")

    ollama_url = os.getenv("OLLAMA_BASE_URL") + "/api/generate"

    prompt = f"""Based on this document content, with your own words and understanding of the content, generate a JSON object with a title 'title' (4 words MAX),
              subject 'subject' (1-2 words MAX), and summary 'summary' (30-40 words MAX). Content: {text[:2000]}. Return ONLY valid JSON without additional formatting"""

    try:
        response = requests.post(
            ollama_url,
            json={
                "model": "llama3.2:latest",
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

    title_words = ai_data["title"].split()[:4]
    ai_data["title"] = (
        " ".join(title_words) if len(title_words) >= 1 else "Untitled Document"
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
