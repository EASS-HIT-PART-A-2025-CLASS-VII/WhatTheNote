from pydantic import BaseModel

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class User(BaseModel):
    id: str
    name: str
    email: str
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    formatted_created_at: str = Field(default_factory=lambda: datetime.utcnow().strftime('%d/%m/%Y'))

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    
class Query(BaseModel):
    question: str
    answer: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class QueryRequest(BaseModel):
    question: str

class DocumentWithDetails(BaseModel):
    id: int
    title: str
    subject: str
    content: str
    summary: str
    uploadedDate: datetime = Field(default_factory=datetime.utcnow)
    lastViewed: Optional[datetime] = None

    class Config:
        json_encoders = {
            datetime: lambda dt: dt.isoformat()
        }

class UserInDB(User):
    documents: List[DocumentWithDetails] = []
    hashed_password: str