import pytest
from unittest.mock import patch, AsyncMock
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from app.services.auth import authenticate_user, create_access_token
from app.schemas.user_schemas import UserInDB


@pytest.mark.asyncio
async def test_authenticate_user_success(mock_db):

    mock_user_data = {
        "id": "1",
        "email": "test@example.com",
        "name": "Test User",
        "hashed_password": "hashed_password",
        "createdAt": datetime(2023, 1, 1, 0, 0, 0, tzinfo=ZoneInfo("Asia/Jerusalem")),
        "documents": [],
    }

    with patch(
        "app.services.auth.get_user_by_email", AsyncMock(return_value=mock_user_data)
    ):
        with patch("app.services.auth.verify_password", return_value=True):

            user = await authenticate_user(mock_db, "test@example.com", "password123")

            assert user is not False
            assert isinstance(user, UserInDB)
            assert user.email == "test@example.com"
            assert user.hashed_password == "hashed_password"


@pytest.mark.asyncio
async def test_authenticate_user_wrong_password(mock_db):

    mock_user_data = {
        "id": "1",
        "email": "test@example.com",
        "name": "Test User",
        "hashed_password": "hashed_password",
        "createdAt": datetime(2023, 1, 1, 0, 0, 0, tzinfo=ZoneInfo("Asia/Jerusalem")),
        "documents": [],
    }

    with patch(
        "app.services.auth.get_user_by_email", AsyncMock(return_value=mock_user_data)
    ):
        with patch("app.services.auth.verify_password", return_value=False):
            user = await authenticate_user(mock_db, "test@example.com", "wrong_password")
            assert user == False


@pytest.mark.asyncio
async def test_authenticate_user_not_found(mock_db):
    with patch("app.services.auth.get_user_by_email", AsyncMock(return_value=None)):
        user = await authenticate_user(
            mock_db, "nonexistent@example.com", "password123"
        )
        assert user == False


def test_create_access_token():
    data = {"sub": "test@example.com"}
    expires_delta = timedelta(minutes=15)

    token = create_access_token(data, expires_delta)

    assert isinstance(token, str)
    assert len(token) > 0
