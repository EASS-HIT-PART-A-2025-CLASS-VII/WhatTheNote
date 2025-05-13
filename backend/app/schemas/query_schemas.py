from pydantic import BaseModel, Field
from datetime import datetime


class Query(BaseModel):
    question: str
    answer: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class QueryRequest(BaseModel):
    question: str
