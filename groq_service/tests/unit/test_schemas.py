import pytest
from pydantic import ValidationError
from app.schemas.groq_schema import GroqRequest


class TestGroqRequest:
    """Test GroqRequest schema validation"""

    def test_valid_groq_request(self):
        """Test valid GroqRequest creation"""
        request = GroqRequest(prompt="Test prompt")
        assert request.prompt == "Test prompt"
        assert request.model == "llama3-70b-8192"  # Default model

    def test_custom_model(self):
        """Test GroqRequest with custom model"""
        request = GroqRequest(prompt="Test prompt", model="custom-model")
        assert request.prompt == "Test prompt"
        assert request.model == "custom-model"

    def test_empty_prompt(self):
        """Test GroqRequest with empty prompt"""
        request = GroqRequest(prompt="")
        assert request.prompt == ""
        assert request.model == "llama3-70b-8192"

    def test_missing_prompt(self):
        """Test GroqRequest without prompt raises ValidationError"""
        with pytest.raises(ValidationError):
            GroqRequest()

    def test_invalid_field_type(self):
        """Test GroqRequest with invalid field types"""
        with pytest.raises(ValidationError):
            GroqRequest(prompt=123)

        with pytest.raises(ValidationError):
            GroqRequest(prompt="Test", model=123)
