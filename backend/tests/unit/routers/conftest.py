import sys
from pathlib import Path
import pytest
import asyncio
from datetime import datetime
from zoneinfo import ZoneInfo
from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent.parent.parent))
from app.main import app
from app.schemas.user_schemas import User


@pytest.fixture
def test_client():
    return TestClient(app)


@pytest.fixture
def mock_user():
    return User(
        id="1",
        name="Test User",
        email="test@example.com",
        createdAt=datetime.now(ZoneInfo("Asia/Jerusalem")),
    )


@pytest.fixture
def mock_document():
    return {
        "id": 1,
        "title": "Test Document",
        "subject": "Test Subject",
        "content": "Test content for the document",
        "summary": "Test summary",
        "uploadedDate": datetime.now(ZoneInfo("Asia/Jerusalem")),
        "lastViewed": None,
        "queries": [],
    }


@pytest.fixture(scope="session")
def event_loop_policy():
    return asyncio.DefaultEventLoopPolicy()
