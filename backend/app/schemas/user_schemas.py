from pydantic import ConfigDict, BaseModel, Field
from datetime import datetime
from zoneinfo import ZoneInfo
from typing import Optional, List
from .document_schemas import DocumentWithDetails


class User(BaseModel):
    id: str
    name: str
    email: str
    createdAt: datetime = Field(
        default_factory=lambda: datetime.now(ZoneInfo("Asia/Jerusalem"))
    )
    formatted_created_at: str = Field(
        default_factory=lambda: datetime.now(ZoneInfo("Asia/Jerusalem")).isoformat()
    )


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None


class UserInDB(User):
    model_config = ConfigDict()
    documents: List[DocumentWithDetails] = []
    hashed_password: str
