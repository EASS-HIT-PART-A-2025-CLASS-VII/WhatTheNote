from pydantic import BaseModel, Field
from datetime import datetime
from zoneinfo import ZoneInfo


class Query(BaseModel):
    question: str
    answer: str
    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(ZoneInfo("Asia/Jerusalem"))
    )


class QueryRequest(BaseModel):
    question: str
