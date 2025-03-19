import os
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MongoDB connection details
DB_URL = os.getenv("DB_URL")

# Create a MongoDB client
async def get_db_client():
    client = AsyncIOMotorClient(DB_URL)
    return client

# Get database instance
async def get_database():
    client = await get_db_client()
    return client[os.getenv("DB_NAME")]

# Get users collection
async def get_users_collection():
    db = await get_database()
    return db["users"]

# User operations
async def get_user_by_email(email):
    users = await get_users_collection()
    return await users.find_one({"email": email})

async def create_user(user_data):
    users = await get_users_collection()
    return await users.insert_one(user_data)

def update_user_by_email(email, update_data):
    users = get_users_collection()
    return users.update_one({"email": email}, {"$set": update_data})

async def update_user(user_id, update_data):
    users = await get_users_collection()
    return await users.update_one(
        {"id": user_id},
        {"$set": update_data}
    )

async def delete_user(user_id):
    users = await get_users_collection()
    return await users.delete_one({"id": user_id})

# Document operations
async def add_document_to_user(user_id, document_data):
    users = await get_users_collection()
    return await users.update_one(
        {"id": user_id},
        {"$push": {"documents": document_data}}
    )

async def get_user_documents(user_id):
    users = await get_users_collection()
    user = await users.find_one({"id": user_id})
    return user.get("documents", []) if user else []

async def update_document(user_id, document_id, update_data):
    users = await get_users_collection()
    return await users.update_one(
        {"id": user_id, "documents.id": document_id},
        {"$set": {"documents.$": update_data}}
    )

async def add_query_to_document(user_id, document_id, query_data):
    users = await get_users_collection()
    return await users.update_one(
        {"id": user_id, "documents.id": document_id},
        {"$push": {"documents.$.queries": query_data}}
    )