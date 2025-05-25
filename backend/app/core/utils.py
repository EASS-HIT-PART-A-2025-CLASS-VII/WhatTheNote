from passlib.context import CryptContext
from fastapi import HTTPException
import os
from app.core.prompts import TEXT_CLEANUP_PROMPT
import httpx
import json
import logging

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
logger = logging.getLogger(__name__)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def get_ollama_url(endpoint: str = "/api/generate") -> str:
    base_url = os.getenv("OLLAMA_BASE_URL")
    if not base_url:
        raise HTTPException(status_code=500, detail="OLLAMA_BASE_URL not configured")
    return base_url.rstrip("/") + endpoint


async def call_llm(prompt: str, model: str = "qwen3:1.7b", format: str | None = None) -> dict:
    ollama_url = get_ollama_url()
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False,
    }
    if format:
        payload["format"] = format

    try:
        async with httpx.AsyncClient(timeout=300) as client:
            response = await client.post(ollama_url, json=payload)
            response.raise_for_status()
            llm_response = response.json()
            logger.info(f"Ollama response: {llm_response}")
            return llm_response
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
        logger.exception("Unexpected error during LLM call")
        raise HTTPException(status_code=500, detail=f"LLM call failed: {str(e)}")


async def clean_text_with_llm(raw_text: str, model: str = "gemma2:2b") -> str:
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

        return response_data["response"]

    except Exception as e:
        raise RuntimeError(f"LLM cleanup failed: {str(e)}")
