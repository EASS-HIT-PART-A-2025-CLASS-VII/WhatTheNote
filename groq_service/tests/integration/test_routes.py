import pytest
from unittest.mock import patch, AsyncMock, MagicMock
import httpx
from fastapi import HTTPException


class TestGroqRoutes:
    """Integration tests for Groq API routes"""

    def test_call_groq_missing_api_key(self, client):
        """Test /call-groq endpoint without API key"""
        with patch.dict("os.environ", {}, clear=True):
            response = client.post("/call-groq", json={"prompt": "Test prompt"})
            assert response.status_code == 500
            assert "GROQ_API_KEY not configured" in response.json()["detail"]

    @patch("httpx.AsyncClient")
    def test_call_groq_success(
        self, mock_client, client, mock_groq_api_key, mock_groq_response
    ):
        """Test successful /call-groq endpoint"""
        # Create a mock response that behaves synchronously
        mock_response = MagicMock()
        mock_response.json.return_value = mock_groq_response
        mock_response.raise_for_status.return_value = None

        # Create async context manager mock
        mock_async_client = AsyncMock()
        mock_async_client.post.return_value = mock_response
        mock_client.return_value.__aenter__.return_value = mock_async_client

        response = client.post(
            "/call-groq", json={"prompt": "Test prompt", "model": "llama3-70b-8192"}
        )

        assert response.status_code == 200
        assert response.json() == mock_groq_response

    @patch("httpx.AsyncClient")
    def test_call_groq_http_error(self, mock_client, client, mock_groq_api_key):
        """Test /call-groq endpoint with HTTP error"""
        # Mock HTTP error
        mock_response = MagicMock()
        mock_response.status_code = 400
        mock_response.text = "Bad Request"

        # Create async client mock that raises HTTPStatusError
        mock_async_client = AsyncMock()
        mock_async_client.post.side_effect = httpx.HTTPStatusError(
            "Bad Request", request=MagicMock(), response=mock_response
        )
        mock_client.return_value.__aenter__.return_value = mock_async_client

        response = client.post("/call-groq", json={"prompt": "Test prompt"})

        assert response.status_code == 502
        assert "Groq API error" in response.json()["detail"]

    @patch("httpx.AsyncClient")
    def test_call_groq_timeout_error(self, mock_client, client, mock_groq_api_key):
        """Test /call-groq endpoint with timeout error"""
        # Create async client mock that raises TimeoutException
        mock_async_client = AsyncMock()
        mock_async_client.post.side_effect = httpx.TimeoutException("Timeout")
        mock_client.return_value.__aenter__.return_value = mock_async_client

        response = client.post("/call-groq", json={"prompt": "Test prompt"})

        assert response.status_code == 500
        assert "Groq call failed" in response.json()["detail"]

    @patch("app.routes.groq_routes.call_groq_endpoint")
    def test_clean_text_success(self, mock_call_groq, client, mock_groq_response):
        """Test successful /clean-text endpoint"""
        # Mock the call_groq_endpoint function to return the response directly
        mock_call_groq.return_value = mock_groq_response

        response = client.post("/clean-text", json={"prompt": "Raw PDF text to clean"})

        assert response.status_code == 200
        assert "content" in response.json()
        assert response.json()["content"] == "This is a test response from Groq API"

    @patch("app.routes.groq_routes.call_groq_endpoint")
    def test_clean_text_missing_choices(self, mock_call_groq, client):
        """Test /clean-text endpoint with malformed response"""
        mock_call_groq.return_value = {"invalid": "response"}

        response = client.post("/clean-text", json={"prompt": "Raw PDF text to clean"})

        assert response.status_code == 200
        assert "error" in response.json()

    def test_invalid_request_body(self, client, mock_groq_api_key):
        """Test endpoints with invalid request body"""
        response = client.post("/call-groq", json={"invalid_field": "value"})
        assert response.status_code == 422

        response = client.post(
            "/clean-text", json={"model": "test-model"}  # Missing prompt
        )
        assert response.status_code == 422
