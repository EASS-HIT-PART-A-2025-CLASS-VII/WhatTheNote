import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

DB_URL = os.getenv("DB_URL")
DB_NAME = os.getenv("DB_NAME")

client = AsyncIOMotorClient(DB_URL)
db = client[DB_NAME]


async def get_database():
    return db
