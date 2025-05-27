from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta, datetime
from zoneinfo import ZoneInfo
import uuid
import os

from app.schemas.user_schemas import User, UserUpdate
from app.schemas.token_schema import Token
from app.core.utils import get_password_hash
from app.services.auth import (
    get_current_user,
    authenticate_user,
    create_access_token,
)
from app.services.database.core import get_database
from app.services.database.user import *

load_dotenv()
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

router = APIRouter()


@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    db = await get_database()
    user = await authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/users/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/users/me")
async def update_user_me(
    user_update: UserUpdate = Body(...), current_user: User = Depends(get_current_user)
):
    try:
        if user_update.email is not None:
            existing_user = await get_user_by_email(user_update.email)
            if existing_user and existing_user["id"] != current_user.id:
                raise HTTPException(status_code=400, detail="Email already registered")
    except AttributeError:
        raise HTTPException(
            status_code=422, detail="Invalid request format - must use JSON body"
        )

    update_data = user_update.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="No valid fields to update")

    update_result = await update_user(current_user.id, update_data)
    if not update_result.modified_count:
        raise HTTPException(status_code=500, detail="Failed to update user")

    users_collection = await get_users_collection()
    updated_document = await users_collection.find_one({"id": current_user.id})
    return User(**updated_document)


@router.delete("/users/me")
async def delete_user_me(current_user: User = Depends(get_current_user)):
    result = await delete_user(current_user.id)
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}


@router.post("/register", response_model=User)
async def register_user(user_data: dict = Body(...)):
    email = user_data.get("email")
    password = user_data.get("password")
    name = user_data.get("name")

    existing_user = await get_user_by_email(email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )

    user_id = str(uuid.uuid4())
    hashed_password = get_password_hash(password)

    user_data = {
        "id": user_id,
        "name": name,
        "email": email,
        "hashed_password": hashed_password,
        "documents": [],
        "createdAt": datetime.now(ZoneInfo("Asia/Jerusalem")),
    }

    await create_user(user_data)

    return User(id=user_id, name=name, email=email, createdAt=user_data["createdAt"])
