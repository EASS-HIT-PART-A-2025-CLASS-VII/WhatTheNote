from pydantic import BaseModel


class GroqRequest(BaseModel):
    prompt: str
    model: str = "llama3-70b-8192"
