import sys
import os
from pathlib import Path
import pytest
from unittest.mock import AsyncMock

# Add the backend directory (parent of tests) to Python path
backend_root = Path(__file__).parent.parent
sys.path.insert(0, str(backend_root))

# Verify the app module can be imported
try:
    import app

    print(f"Successfully imported app from: {app.__file__}")
except ImportError as e:
    print(f"Failed to import app: {e}")
    print(f"Python path: {sys.path}")

# Set environment variables for testing
os.environ["DB_URL"] = "mongodb://localhost:27017"
os.environ["DB_NAME"] = "test_db"
os.environ["SECRET_KEY"] = "test_secret_key"
os.environ["ALGORITHM"] = "HS256"
os.environ["ACCESS_TOKEN_EXPIRE_MINUTES"] = "30"
os.environ["GROQ_SERVICE_URL"] = "http://localhost:8001"


@pytest.fixture
def mock_db():
    return AsyncMock()
