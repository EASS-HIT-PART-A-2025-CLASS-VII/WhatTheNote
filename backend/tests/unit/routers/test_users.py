import sys
from pathlib import Path
import pytest
from unittest.mock import patch
from fastapi import HTTPException

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent.parent.parent))
from app.routers.users import register_user, read_users_me


@pytest.mark.asyncio
async def test_register_user_success():

    user_data = {
        "email": "new@example.com",
        "password": "password123",
        "name": "New User",
    }

    with patch(
        "app.routers.users.get_user_by_email", return_value=None
    ) as mock_get_user, patch(
        "app.routers.users.get_password_hash", return_value="hashed_password"
    ) as mock_hash, patch(
        "app.routers.users.create_user"
    ) as mock_create_user:

        result = await register_user(user_data)

        assert result.email == "new@example.com"
        assert result.name == "New User"
        mock_get_user.assert_called_once_with("new@example.com")
        mock_hash.assert_called_once_with("password123")
        mock_create_user.assert_called_once()


@pytest.mark.asyncio
async def test_register_user_email_exists():

    user_data = {
        "email": "existing@example.com",
        "password": "password123",
        "name": "New User",
    }

    with patch(
        "app.routers.users.get_user_by_email", return_value={"id": "existing-id"}
    ) as mock_get_user, pytest.raises(HTTPException) as exc_info:

        await register_user(user_data)

        assert exc_info.value.status_code == 400
        assert exc_info.value.detail == "Email already registered"
        mock_get_user.assert_called_once_with("existing@example.com")


@pytest.mark.asyncio
async def test_read_users_me(mock_user):

    result = await read_users_me(mock_user)

    assert result == mock_user
