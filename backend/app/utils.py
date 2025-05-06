from passlib.context import CryptContext
from fastapi import HTTPException
import os

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def get_ollama_url(endpoint: str = "/api/generate") -> str:
    base_url = os.getenv("OLLAMA_BASE_URL")
    if not base_url:
        raise HTTPException(status_code=500, detail="OLLAMA_BASE_URL not configured")
    return base_url.rstrip("/") + endpoint