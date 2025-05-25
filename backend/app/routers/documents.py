from fastapi import APIRouter, Depends, HTTPException, Body, UploadFile, File, status
from typing import List
from datetime import datetime
from zoneinfo import ZoneInfo
import json
import httpx
import pdfplumber
from io import BytesIO
import re

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
from app.core.utils import get_ollama_url, clean_text_with_llm, call_llm
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
    llm_response = await call_llm(prompt)
    
    raw_answer = llm_response.get("response", "").strip()
    cleaned_answer = re.sub(r"<think>.*?</think>", "", raw_answer, flags=re.DOTALL).strip()

    query_data = {
        "question": query.question,
        "answer": cleaned_answer,
        "timestamp": datetime.now(ZoneInfo("Asia/Jerusalem")),
    }

    result = await add_query_to_document(current_user.id, document_id, query_data)
    if not result.modified_count:
        raise HTTPException(
            status_code=500, detail="Failed to save query to database"
        )

    return query_data


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
    prompt = UPLOAD_PROMPT.format(text=cleaned_text)
    llm_response = await call_llm(prompt, format="json")

    if "response" not in llm_response:
        raise HTTPException(status_code=500, detail="Missing 'response' field in LLM output")

    try:
        ai_data = json.loads(llm_response["response"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Invalid JSON in LLM response: {str(e)}")

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

