import sys
from pathlib import Path
import pytest
from unittest.mock import patch
from fastapi import HTTPException

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent.parent.parent))
from app.routers.documents import get_documents, get_single_document


@pytest.mark.asyncio
async def test_get_documents(mock_user):

    mock_documents = [
        {"id": 1, "title": "Doc 1"},
        {"id": 2, "title": "Doc 2"},
    ]

    with patch(
        "app.routers.documents.get_user_documents", return_value=mock_documents
    ) as mock_get_docs:

        result = await get_documents(mock_user)

        assert result == mock_documents
        mock_get_docs.assert_called_once_with(mock_user.id)


@pytest.mark.asyncio
async def test_get_single_document_success(mock_user, mock_document):

    with patch(
        "app.routers.documents.get_document", return_value=mock_document
    ) as mock_get_doc, patch(
        "app.routers.documents.update_document_last_viewed"
    ) as mock_update_viewed:

        result = await get_single_document(1, mock_user)

        assert result == mock_document
        mock_get_doc.assert_called_once_with(mock_user.id, 1)
        mock_update_viewed.assert_called_once_with(mock_user.id, 1)


@pytest.mark.asyncio
async def test_get_single_document_not_found(mock_user):

    with patch(
        "app.routers.documents.get_document", return_value=None
    ) as mock_get_doc, pytest.raises(HTTPException) as exc_info:

        await get_single_document(999, mock_user)

        assert exc_info.value.status_code == 404
        assert exc_info.value.detail == "Document not found"
        mock_get_doc.assert_called_once_with(mock_user.id, 999)
