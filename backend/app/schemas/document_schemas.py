from pydantic import BaseModel, Field, ConfigDict, field_serializer
from datetime import datetime
from zoneinfo import ZoneInfo
from typing import Optional


class DocumentWithDetails(BaseModel):
    id: int
    title: str
    subject: str
    content: str
    summary: str
    uploadedDate: datetime = Field(
        default_factory=lambda: datetime.now(ZoneInfo("Asia/Jerusalem"))
    )
    lastViewed: Optional[datetime] = None

    model_config = ConfigDict()

    @field_serializer("uploadedDate", "lastViewed")
    def serialize_dt(self, value):
        if value is None:
            return None
        return value.isoformat()
