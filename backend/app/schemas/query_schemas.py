from pydantic import BaseModel, Field
from datetime import datetime


class Query(BaseModel):
    question: str
    answer: str
    timestamp: datetime = Field(default_factory=datetime.now(ZoneInfo("Asia/Jerusalem")))


class QueryRequest(BaseModel):
    question: str
