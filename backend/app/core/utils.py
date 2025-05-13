from passlib.context import CryptContext
from fastapi import HTTPException
import os
from app.core.prompts import TEXT_CLEANUP_PROMPT
import httpx

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


async def clean_text_with_llm(raw_text: str, model: str = "gemma3:1b") -> str:
    prompt = TEXT_CLEANUP_PROMPT.format(raw_text=raw_text)

    ollama_url = get_ollama_url()
    try:
        async with httpx.AsyncClient(timeout=300) as client:
            response = await client.post(
                ollama_url,
                json={"model": model, "prompt": prompt, "stream": False},
            )
            response.raise_for_status()
            response_data = response.json()
        if "response" not in response_data:
            raise ValueError("Missing 'response' field in Ollama output")

        cleaned_text = (
            response_data["response"]
            .replace("```", "")  # Remove code fences if present
            .strip()
        )
        return cleaned_text

    except Exception as e:
        raise RuntimeError(f"LLM cleanup failed: {str(e)}")
