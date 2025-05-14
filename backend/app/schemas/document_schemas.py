from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class DocumentWithDetails(BaseModel):
    id: int
    title: str
    subject: str
    content: str
    summary: str
    uploadedDate: datetime = Field(default_factory=datetime.now(ZoneInfo("Asia/Jerusalem")))
    lastViewed: Optional[datetime] = None

    class Config:
        json_encoders = {datetime: lambda dt: dt.isoformat()}
