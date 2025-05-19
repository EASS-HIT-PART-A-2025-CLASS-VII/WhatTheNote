import sys
from pathlib import Path
import pytest
from unittest.mock import patch, AsyncMock
from datetime import datetime
from zoneinfo import ZoneInfo

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent.parent.parent))
from app.services.db import get_user_documents, get_document, add_document_to_user


@pytest.mark.asyncio
async def test_get_user_documents(mock_users_collection):

    mock_user = {
        "id": "test-user-id",
        "documents": [
            {"id": 1, "title": "Doc 1"},
            {"id": 2, "title": "Doc 2"},
        ],
    }
    mock_users_collection.find_one.return_value = mock_user

    result = await get_user_documents("test-user-id", "All Subjects")

    assert result == mock_user["documents"]
    mock_users_collection.find_one.assert_called_once_with({"id": "test-user-id"})


@pytest.mark.asyncio
async def test_get_document(mock_users_collection):

    mock_user = {
        "documents": [
            {
                "id": 1,
                "title": "Test Document",
                "content": "Test content",
                "subject": "Test Subject",
                "uploadedDate": datetime.now(ZoneInfo("Asia/Jerusalem")),
            }
        ]
    }
    mock_users_collection.find_one.return_value = mock_user

    result = await get_document("test-user-id", 1)

    assert result is not None
    assert result["id"] == 1
    assert result["title"] == "Test Document"
    mock_users_collection.find_one.assert_called_once()


@pytest.mark.asyncio
async def test_add_document_to_user(mock_users_collection):

    mock_users_collection.update_one.return_value = AsyncMock(modified_count=1)
    document_data = {"id": 1, "title": "New Document"}

    result = await add_document_to_user("test-user-id", document_data)

    assert result.modified_count == 1
    mock_users_collection.update_one.assert_called_once_with(
        {"id": "test-user-id"}, {"$push": {"documents": document_data}}
    )
