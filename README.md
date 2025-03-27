# WhatTheNote - AI-Powered Document Intelligence Platform

## About the Project
WhatTheNote is a full-stack application that transforms PDF documents into interactive knowledge bases using AI. Key capabilities include:

- 📄 PDF text extraction and analysis
- 🧠 AI-powered summarization and question answering
- 🔍 Smart document querying with natural language
- 📁 Secure document management with user authentication
- 📈 Interactive dashboard for document insights

## Technology Used

### Backend
- **FastAPI** - Python REST API framework
- **MongoDB** - NoSQL database for document storage
- **PyPDF2** - PDF text extraction library
- **Ollama** - Local LLM for AI processing
- **Motor** - Async MongoDB driver
- **Pydantic** - Data validation and settings management
- **bcrypt** - Password hashing

### Frontend
- **React** - Component-based UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Modern UI components
- **Axios** - HTTP client for API calls
- **React Router** - Client-side routing

## Features

### Core Functionality
- Secure JWT authentication flow
- PDF upload with text extraction
- AI-generated document summaries
- Natural language document querying
- Document organization by subject
- User profile management

### Technical Highlights
- Async backend operations
- PDF content validation
- Responsive dashboard UI
- Error handling with toasts
- Type-safe API contracts
- CORS-enabled API security

### Upcoming Features
- 🚧 RAG-enhanced document querying
- 🚧 PDF compression before processing
- 🚧 Advanced document analytics
- 🚧 Collaborative document spaces

## Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- MongoDB instance
- Ollama server running locally

### Setup
1. Clone the repository
```bash
git clone https://github.com/yourusername/whatthenote.git
cd whatthenote