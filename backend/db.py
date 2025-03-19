import os
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MongoDB connection details
DB_URL = os.getenv("DB_URL")
DB_NAME = os.getenv("DB_NAME")

# Create async MongoDB client
client = AsyncIOMotorClient(DB_URL)
db = client[DB_NAME]

async def get_database():
    return db

# User operations
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
    return await users.update_one(
        {"id": user_id},
        {"$set": update_data}
    )

async def delete_user(user_id: str):
    users = await get_users_collection()
    return await users.delete_one({"id": user_id})

# Document operations
async def add_document_to_user(user_id: str, document_data: dict):
    users = await get_users_collection()
    return await users.update_one(
        {"id": user_id},
        {"$push": {"documents": document_data}}
    )

async def get_user_documents(user_id: str):
    users = await get_users_collection()
    user = await users.find_one({"id": user_id})
    return user.get("documents", []) if user else []

async def update_document(user_id: str, document_id: str, update_data: dict):
    users = await get_users_collection()
    return await users.update_one(
        {"id": user_id, "documents.id": document_id},
        {"$set": {"documents.$": update_data}}
    )

async def add_query_to_document(user_id: str, document_id: int, query_data: dict):
    users = await get_users_collection()
    return await users.update_one(
        {"id": user_id, "documents.id": document_id},
        {"$push": {"documents.$.queries": query_data}}
    )

async def get_next_document_id():
    counter_collection = db["counters"]
    counter = await counter_collection.find_one_and_update(
        {"_id": "document_id"},
        {"$inc": {"seq": 1}},
        upsert=True,
        return_document=True
    )
    return counter["seq"]


async def get_document(user_id: str, document_id: str):
    try:
        document_id = int(document_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid document ID format")
    try:
        users = await get_users_collection()
        print(f"Searching for user {user_id} with document {document_id}")
        user = await users.find_one(
            {"id": user_id, "documents.id": document_id},
            {"documents.$": 1}
        )
        print(f"Found user document: {bool(user)}")
        if not user or not user.get('documents'):
            return None
        
        doc = user['documents'][0]
        return {
            "id": doc["id"],
            "title": doc["title"],
            "content": doc["content"],
            "subject": doc["subject"],
            "summary": doc.get("summary", ""),
            "queries": doc.get("queries", []),
            "uploadDate": doc["uploadedDate"],
            "lastViewed": doc.get("lastViewed", datetime.utcnow()),
        }
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid document ID")