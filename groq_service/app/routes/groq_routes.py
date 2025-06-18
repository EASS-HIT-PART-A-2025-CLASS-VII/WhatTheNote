from fastapi import APIRouter, HTTPException
from dotenv import load_dotenv
from app.schemas.groq_schema import GroqRequest
from app.core.prompts import TEXT_CLEANUP_PROMPT
import os
import httpx
import logging
import traceback

router = APIRouter()
logger = logging.getLogger(__name__)
load_dotenv()


@router.post("/call-groq")
async def call_groq_endpoint(request: GroqRequest):
    groq_api_key = os.getenv("GROQ_API_KEY")
    if not groq_api_key:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY not configured")

    headers = {
        "Authorization": f"Bearer {groq_api_key}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": request.model,
        "messages": [{"role": "user", "content": request.prompt}],
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


@router.post("/clean-text")
async def clean_text_endpoint(request: GroqRequest):
    prompt = TEXT_CLEANUP_PROMPT.format(raw_text=request.prompt)
    response = await call_groq_endpoint(GroqRequest(prompt=prompt, model=request.model))
    try:
        return {"content": response["choices"][0]["message"]["content"]}
    except Exception as e:
        print("Exception in /clean-text:", e)
        traceback.print_exc()
        return {"error": str(e)}
