import httpx
import json
import os
from PyPDF2 import PdfReader
import io
from fastapi import FastAPI, Depends, HTTPException, status, Body, UploadFile, File
from pydantic import BaseModel
import requests
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta, datetime, timezone
import uuid
from typing import List
from pymongo import MongoClient
from bson import ObjectId
from backend.auth import *
from backend.db import *
from .schemas import QueryRequest

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Temporarily allow all origins for debugging
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*", "Authorization"],
    expose_headers=["Authorization", "*"],
    max_age=600,  # Cache preflight requests for 10 minutes
)

@app.get("/")
async def read_root():
    return {"message": "Hello, World!"}

@app.get('/favicon.ico')
def favicon():
    return {}

@app.get("/features")
async def get_features():
    return [
        {"icon": "FileText", "title": "PDF Processing", "description": "Upload and process PDF files."},
        {"icon": "Brain", "title": "AI Summarization", "description": "Generate concise summaries."},
        {"icon": "Search", "title": "Smart Querying", "description": "Ask questions and get answers."}
    ]

@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    db = await get_database()
    user = await authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@app.put("/users/me")
async def update_user_me(user_update: UserUpdate = Body(...), current_user: User = Depends(get_current_user)):
    # Check if email exists
    try:
        if user_update.email is not None:
            existing_user = await get_user_by_email(user_update.email)
            if existing_user and existing_user['id'] != current_user.id:
                raise HTTPException(status_code=400, detail="Email already registered")
    except AttributeError:
        raise HTTPException(status_code=422, detail="Invalid request format - must use JSON body")

    # Validate update fields
    update_data = user_update.model_dump(exclude_unset=True)
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No valid fields to update")
    
    update_result = await update_user(current_user.id, update_data)
    if not update_result.modified_count:
        raise HTTPException(status_code=500, detail="Failed to update user")
    
    users_collection = await get_users_collection()
    updated_document = await users_collection.find_one({"id": current_user.id})
    return User(**updated_document)

@app.delete("/users/me")
async def delete_user_me(current_user: User = Depends(get_current_user)):
    result = await delete_user(current_user.id)
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}

@app.post("/register", response_model=User)
async def register_user(user_data: dict = Body(...)):
    email = user_data.get("email")
    password = user_data.get("password")
    name = user_data.get("name")
    
    existing_user = await get_user_by_email(email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    user_id = str(uuid.uuid4())
    hashed_password = get_password_hash(password)
    
    user_data = {
        "id": user_id,
        "name": name,
        "email": email,
        "hashed_password": hashed_password,
        "documents": [],
        "createdAt": datetime.now(timezone.utc)
    }
    
    await create_user(user_data)
    
    return User(
        id=user_id,
        name=name,
        email=email,
        createdAt=user_data["createdAt"]
    )
    
@app.get("/documents", response_model=List[DocumentWithDetails])
async def get_documents(current_user: User = Depends(get_current_user)):
    documents = await get_user_documents(current_user.id)
    return documents

@app.get("/documents/{document_id}")
async def get_single_document(document_id: int, current_user: User = Depends(get_current_user)):
    document = await get_document(current_user.id, document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    return document

@app.delete('/documents/{document_id}')
async def delete_a_document(document_id: int, current_user: User = Depends(get_current_user)):
    result = await delete_document(current_user.id, document_id)
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Document not found")
    return {"message": "Document deleted successfully"}
    

@app.post("/documents/{document_id}/query")
async def query_document(document_id: int, query: QueryRequest, current_user: User = Depends(get_current_user)):
    if not isinstance(document_id, int):
        raise HTTPException(status_code=400, detail="Document ID must be an integer")

    doc = await get_document(current_user.id, document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    # LLM prompt with document context
    prompt = f"Document: {doc['content']}\n\nQuestion: {query.question}\nAnswer:"
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                os.getenv("OLLAMA_BASE_URL") + "/api/generate",
                json={
                    "model": "llama3.2:latest",
                    "prompt": prompt,
                    "stream": False
                },
                timeout=30
            )
            response.raise_for_status()
            llm_response = response.json()
            
            query_data = {
                "question": query.question,
                "answer": llm_response.get("response").strip(),
                "timestamp": datetime.utcnow()
            }
            result = await add_query_to_document(current_user.id, document_id, query_data)
            if not result.modified_count:
                raise HTTPException(status_code=500, detail="Failed to save query to database")
            
            return {
                "question": query.question,
                "answer": llm_response.get("response").strip(),
                "timestamp": datetime.utcnow()
            }
    except httpx.RequestError as e:
        raise HTTPException(status_code=503, detail=f"Ollama API unavailable: {str(e)}")
    except (KeyError, json.JSONDecodeError) as e:
        raise HTTPException(status_code=502, detail=f"Invalid response format from Ollama: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM query failed: {str(e)}")

@app.post("/documents/upload")
async def upload_document(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    contents = file.file.read()
    
    # Extract text from PDF
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
                "stream": False
            }
        )
        response.raise_for_status()
        response_data = response.json()
        if 'response' not in response_data:
            raise ValueError("Missing 'response' field in Ollama output")
        
        cleaned_response = response_data['response'].replace('```json', '').replace('```', '').strip()
        ai_data = json.loads(cleaned_response)
        print(ai_data['title'])
    except Exception as e:
        print(f"Document processing error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Document processing failed: {str(e)}"
        )

    # Enforce 4-word title
    title_words = ai_data["title"].split()[:4]
    ai_data["title"] = ' '.join(title_words) if len(title_words) >= 1 else "Untitled Document"

    # Create document object
    document = DocumentWithDetails(
        id=await get_next_document_id(),
        title=ai_data["title"],
        subject=ai_data.get("subject", "General"),
        content=text,
        summary=ai_data["summary"],
        uploadedDate=datetime.now(),
        lastViewed=datetime.now()
    )

    await add_document_to_user(current_user.id, document.model_dump())
    return document
