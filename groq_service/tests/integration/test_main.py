import pytest


class TestMainApp:
    """Test main FastAPI application"""

    def test_health_endpoint(self, client):
        """Test health check endpoint"""
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json() == {"status": "healthy", "service": "backend"}

    def test_app_includes_router(self, client):
        """Test that groq routes are included"""
        # Test that groq endpoints are accessible
        response = client.post("/call-groq", json={"prompt": "test"})
        # Should not return 404 (route exists), but may return 500 (no API key)
        assert response.status_code != 404

        response = client.post("/clean-text", json={"prompt": "test"})
        assert response.status_code != 404
