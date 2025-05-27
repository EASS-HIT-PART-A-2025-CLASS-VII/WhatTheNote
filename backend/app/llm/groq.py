import httpx
import os
from dotenv import load_dotenv

load_dotenv()

GROQ_SERVICE_URL = os.getenv("GROQ_SERVICE_URL")
GROQ_MODEL = "llama3-70b-8192"


async def call_groq(prompt: str, model: str = GROQ_MODEL) -> dict:
    async with httpx.AsyncClient(timeout=60) as client:
        response = await client.post(
            f"{GROQ_SERVICE_URL}/call-groq",
            json={"prompt": prompt, "model": model},
        )
        response.raise_for_status()
        return response.json()


async def clean_text_with_groq(raw_text: str, model: str = GROQ_MODEL) -> str:
    async with httpx.AsyncClient(timeout=60) as client:
        response = await client.post(
            f"{GROQ_SERVICE_URL}/clean-text",
            json={"prompt": raw_text, "model": model},
        )
        response.raise_for_status()
        return response.json()["content"]