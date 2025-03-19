from datetime import datetime, timedelta
from typing import Optional, List
import os

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.concurrency import run_in_threadpool
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel, Field
from dotenv import load_dotenv

from db import get_user_by_email, create_user, update_user, delete_user

# Load environment variables
load_dotenv()

# This is a simplified auth system for demonstration
# In a real app, you would use a database

# Secret key for JWT token from environment variables
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Mock user database - replace with actual database in production
fake_users_db = {
    "user@example.com": {
        "email": "user@example.com",
        "hashed_password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",  # "password"
        "full_name": "Test User",
    }
}

# Models
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

# Document query model
class Query(BaseModel):
    question: str
    answer: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# Document model with details
class DocumentWithDetails(BaseModel):
    id: int
    title: str
    content: str
    subject: str
    summary: str
    queries: List[Query] = []
    uploadedDate: datetime = Field(default_factory=datetime.utcnow)
    lastViewed: datetime = Field(default_factory=datetime.utcnow)

# User in database model with password
class UserInDB(User):
    hashed_password: str
    documents: List[DocumentWithDetails] = []

# Helper functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None


async def get_user(db, email: str):
    # Get user from MongoDB instead of fake DB
    user_dict = await get_user_by_email(email)
    if user_dict:
        return UserInDB(**user_dict)
    return None

async def authenticate_user(fake_db, email: str, password: str):
    user = await get_user(fake_db, email)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = await get_user(None, email=token_data.email)
    if user is None:
        raise credentials_exception
    return user

app = FastAPI()

@app.get("/users/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@app.delete("/users/me", response_model=dict)
async def delete_current_user(current_user: User = Depends(get_current_user)):
    result = await run_in_threadpool(delete_user, current_user.id)
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}