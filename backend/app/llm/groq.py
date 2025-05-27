from fastapi import HTTPException
import os
from app.core.prompts import TEXT_CLEANUP_PROMPT
import httpx
import logging

logger = logging.getLogger(__name__)


async def call_groq(prompt: str, model: str = "llama3-70b-8192") -> dict:
    groq_api_key = os.getenv("GROQ_API_KEY")
    if not groq_api_key:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY not configured")

    headers = {
        "Authorization": f"Bearer {groq_api_key}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7,
    }

    try:
        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers=headers,
                json=payload,
            )
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as e:
        logger.error(f"Groq API error: {str(e)} Response: {e.response.text}")
        raise HTTPException(
            status_code=502, detail=f"Groq API error: {e.response.status_code}"
        )
    except Exception as e:
        logger.exception("Unexpected error during Groq API call")
        raise HTTPException(status_code=500, detail=f"Groq call failed: {str(e)}")


async def clean_text_with_groq(raw_text: str, model: str = "llama3-70b-8192") -> str:
    prompt = TEXT_CLEANUP_PROMPT.format(raw_text=raw_text)
    response = await call_groq(prompt, model)
    try:
        return response["choices"][0]["message"]["content"]
    except (KeyError, IndexError):
        raise RuntimeError("Invalid response from Groq API")
