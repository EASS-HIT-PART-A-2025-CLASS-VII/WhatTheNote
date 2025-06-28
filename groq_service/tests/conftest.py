import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch
import os


@pytest.fixture
def mock_groq_api_key():
    """Mock GROQ_API_KEY environment variable"""
    with patch.dict(os.environ, {"GROQ_API_KEY": "test_api_key"}):
        yield "test_api_key"


@pytest.fixture
def client():
    """Create a test client for the FastAPI app"""
    from app.main import app

    return TestClient(app)


@pytest.fixture
def mock_groq_response():
    """Mock response from Groq API"""
    return {
        "choices": [{"message": {"content": "This is a test response from Groq API"}}]
    }


@pytest.fixture
def sample_groq_request():
    """Sample request data for testing"""
    return {"prompt": "Test prompt", "model": "llama3-70b-8192"}
