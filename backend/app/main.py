from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.auth import *
from app.db import *
from app.documents import router as documents_router
from app.users import router as users_router

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

app.include_router(documents_router)
app.include_router(users_router)

@app.get("/")
async def read_root():
    return {"message": "Hello, World!"}

@app.get("/favicon.ico")
def favicon():
    return {}

@app.get("/features")
async def get_features():
    return [
        {
            "icon": "FileText",
            "title": "PDF Processing",
            "description": "Upload and process PDF files.",
        },
        {
            "icon": "Brain",
            "title": "AI Summarization",
            "description": "Generate concise summaries.",
        },
        {
            "icon": "Search",
            "title": "Smart Querying",
            "description": "Ask questions and get answers.",
        },
    ]