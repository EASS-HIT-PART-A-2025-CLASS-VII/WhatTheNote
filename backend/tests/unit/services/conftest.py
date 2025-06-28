import sys
from pathlib import Path
import pytest
from unittest.mock import AsyncMock, patch
import asyncio

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent.parent.parent))
from app.main import app


@pytest.fixture
def mock_db():
    """Mock database connection"""
    with patch("app.services.database.core.get_database") as mock_get_db:
        mock_db = AsyncMock()
        mock_get_db.return_value = mock_db
        yield mock_db


@pytest.fixture
def mock_users_collection():
    """Mock users collection"""
    with patch(
        "app.services.database.user.get_users_collection", new_callable=AsyncMock
    ) as mock_get_users, patch(
        "app.services.database.documents.get_users_collection", new_callable=AsyncMock
    ) as mock_get_docs_users:
        mock_collection = AsyncMock()
        mock_get_users.return_value = mock_collection
        mock_get_docs_users.return_value = mock_collection
        yield mock_collection


@pytest.fixture(scope="session")
def event_loop_policy():
    return asyncio.DefaultEventLoopPolicy()
