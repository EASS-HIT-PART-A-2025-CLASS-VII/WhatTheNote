# WhatTheNote - AI-Powered Document Intelligence Platform

## About the Project
WhatTheNote is a full-stack application that transforms PDF documents into interactive, AI-powered knowledge bases. It leverages state-of-the-art LLMs for summarization, querying, and content cleanup, providing a seamless experience for document management and exploration.

**Key capabilities include:**
- 📄 PDF text extraction and analysis
- 🧠 AI-powered summarization and question answering
- 🔍 Smart document querying with natural language
- 📁 Secure document management with user authentication
- 📈 Interactive dashboard for document insights

---

## 🚀 Tech Stack

**Backend**
- [FastAPI](https://fastapi.tiangolo.com/) (Python 3.13+)
- [MongoDB](https://www.mongodb.com/) (Document storage)
- [Ollama](https://ollama.com/) (Local LLM inference)
- [Groq API](https://console.groq.com/) (Cloud LLM inference)
- [Pydantic](https://docs.pydantic.dev/) (Validation)
- [bcrypt](https://pypi.org/project/bcrypt/) (Password hashing)

**Frontend**
- [React](https://react.dev/) (18+)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) (UI components)
- [React Router](https://reactrouter.com/)
- [Axios](https://axios-http.com/) (API calls)
- [react-markdown](https://github.com/remarkjs/react-markdown) (Markdown rendering)

**Other**
- [Docker](https://www.docker.com/) (Containerization)
- [Nginx](https://www.nginx.com/) (Frontend static serving)
- [dotenv](https://pypi.org/project/python-dotenv/) (Environment management)

---

## ✨ Features

- 📄 **PDF Upload & Extraction**: Upload PDF files and extract their content.
- 🧠 **AI Summarization**: Generate concise summaries and metadata using LLMs.
- 🔍 **Smart Querying**: Ask questions about your documents and get context-aware answers.
- 🪄 **AI Content Cleanup**: Convert raw PDF text into clean, readable Markdown.
- 📁 **Document Management**: Organize, view, and filter your documents.
- 🔒 **Authentication**: Secure user login and document access.
- 📊 **Dashboard**: Visualize and interact with your document collection.

---

## 🗂️ Project Structure

WhatTheNote/ │ ├── backend/ │ ├── app/ │ │ ├── llm/ │ │ │ ├── groq.py │ │ │ └── prompts.py │ │ ├── main.py │ │ └── ... (other backend modules) │ ├── Dockerfile │ └── requirements.txt │ ├── frontend/ │ ├── src/ │ │ ├── pages/ │ │ │ └── DocumentView.tsx │ │ └── ... (components, utils, etc.) │ ├── public/ │ ├── Dockerfile │ ├── package.json │ └── index.html │ ├── groq_service/ │ ├── app/ │ │ ├── routes/ │ │ │ └── groq_routes.py │ │ ├── core/ │ │ │ └── prompts.py │ │ └── ... (schemas, main.py, etc.) │ ├── Dockerfile │ └── requirements.txt │ ├── docker-compose.yml ├── .env ├── README.md └── ...


---

## 🧩 Key Components

- **[`backend/app/llm/groq.py`](backend/app/llm/groq.py)**: Handles async calls to the Groq LLM service for text cleanup and querying.
- **[`backend/app/llm/prompts.py`](backend/app/llm/prompts.py)**: Contains prompt templates for summarization, querying, and cleanup.
- **[`groq_service/app/routes/groq_routes.py`](groq_service/app/routes/groq_routes.py)**: FastAPI endpoints for Groq LLM operations.
- **[`frontend/src/pages/DocumentView.tsx`](frontend/src/pages/DocumentView.tsx)**: Main UI for viewing, querying, and interacting with documents.
- **[`docker-compose.yml`](docker-compose.yml)**: Orchestrates backend, frontend, and Groq service containers.

---

## 🏃‍♂️ Running the Project with Docker

1. **Clone the repository**
    ```sh
    git clone https://github.com/yourusername/whatthenote.git
    cd whatthenote
    ```

2. **Configure Environment Variables**
    - Copy `.env.example` to `.env` (if provided) or create a `.env` file in the root.
    - Set your MongoDB URI, Groq API key, and other secrets:
      ```
      DB_URL=mongodb://...
      GROQ_API_KEY=your_groq_api_key
      GROQ_SERVICE_URL=http://groq:9000
      OLLAMA_BASE_URL=http://localhost:11434
      ```

3. **Get a Groq API Key**
    - Sign up at [Groq Console](https://console.groq.com/).
    - Create an API key and add it to your `.env` as `GROQ_API_KEY`.

4. **Start All Services**
    ```sh
    docker-compose up --build
    ```
    - Backend: [http://localhost:8000](http://localhost:8000)
    - Frontend: [http://localhost:3000](http://localhost:3000)
    - Groq Service: [http://localhost:9000](http://localhost:9000)

5. **(Optional) Run Ollama Locally**
    - Download and start Ollama from [https://ollama.com/](https://ollama.com/).
    - Ensure `OLLAMA_BASE_URL` in [.env](http://_vscodecontentref_/12) matches your Ollama server.

---

## 📝 Example Usage

- **Upload a PDF**: Go to the dashboard, click "Upload", and select a PDF file.
- **View Document**: Click on a document to see its AI-generated summary, cleaned content, and ask questions.
- **Ask Questions**: Use the "Ask a Question" tab to query the document with natural language.

---

## 🛠️ Development

- **Frontend**:  
    ```sh
    cd frontend
    npm install
    npm run dev
    ```

- **Backend**:
    ```sh
    cd backend
    pip install -r requirements.txt
    uvicorn app.main:app --reload
    ```

- **Groq Service**:
    ```sh
    cd groq_service
    pip install -r requirements.txt
    uvicorn app.main:app --reload --port 9000
    ```

--- 

📚 Additional Notes
PDFs are processed securely; only authenticated users can access their documents.
LLM calls are routed via the Groq service for fast, scalable inference.
Markdown rendering ensures readable, well-formatted document content.
