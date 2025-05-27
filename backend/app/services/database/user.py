import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

DB_URL = os.getenv("DB_URL")
DB_NAME = os.getenv("DB_NAME")

client = AsyncIOMotorClient(DB_URL)
db = client[DB_NAME]


async def get_users_collection():
    return db["users"]


async def get_user_by_email(email: str):
    users = await get_users_collection()
    return await users.find_one({"email": email})


async def create_user(user_data):
    users = await get_users_collection()
    return await users.insert_one(user_data)


async def update_user(user_id: str, update_data: dict):
    users = await get_users_collection()
    return await users.update_one({"id": user_id}, {"$set": update_data})


async def delete_user(user_id: str):
    users = await get_users_collection()
    return await users.delete_one({"id": user_id})
