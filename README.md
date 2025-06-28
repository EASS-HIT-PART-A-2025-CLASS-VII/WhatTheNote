# WhatTheNote
<div align="center">
    A full-stack application that transforms PDF documents into interactive, AI-powered knowledge bases. It leverages Groq LLM for summarization, querying, and content cleanup, providing a seamless experience for document management and exploration. 

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI-blue?style=for-the-badge&logo=google&logoColor=white)](https://gemini.google.com/chat)
[![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)](https://nginx.org/)
    
<img src="https://i.ibb.co/pvt184tm/What-The-Note-seamless-sharpened.jpg" alt="Logo" />
</div>

## Features
- **PDF Upload & Extraction**: Upload PDF files and extract their content.
- **AI Summarization**: Generate concise summaries and metadata using LLMs.
- **Smart Querying**: Ask questions about your documents and get context-aware answers.
- **AI Content Cleanup**: Convert raw PDF text into clean, readable Markdown.
- **Document Management**: Organize, view, and filter your documents.
- **Authentication**: Secure user login and document access.
- **Dashboard**: Visualize and interact with your document collection.


## Demo Video
<p align="center">
  <a href="https://youtu.be/j80cycrmFzI">
    <img src="https://img.youtube.com/vi/j80cycrmFzI/0.jpg" alt="WhatTheNote Demo" />
  </a>
</p>


## Project Directory Structure
```sh
WhatTheNote/
├── backend
├── frontend
├── groq_service
└── README.md
```


## Project Architecture
![Architecture](https://i.ibb.co/hRkXj1Wn/Untitled-2025-03-16-2021.png)


## Running the Project with Docker
1. **Install Docker**<br>
    Install Docker and run it on your machine.

2. **Clone the repository**
    ```sh
    git clone https://github.com/EASS-HIT-PART-A-2025-CLASS-VII/WhatTheNote
    cd WhatTheNote
    ```

3. **Get a Groq API Key**
    - Sign up at [Groq Console](https://console.groq.com/).
    - Create an API key using the button on the homepage
    - Copy the generated API key

4. **Configure Environment Variables**
    - Create a `.env` file in the root:
    ```sh
    touch .env
    ```
    - Add the following content to the `.env` file:
    ```sh
    echo "GROQ_API_KEY=your_groq_api_key" >> .env
    echo "GROQ_SERVICE_URL=http://groq:9000" >> .env
    ```
    - Replace `your_groq_api_key` with the actual API key you generated earlier.

5. **Start All Services**
    ```sh
    docker-compose up --build
    ```
    **The following services should start:**
    - Backend
    - Frontend
    - Groq Service

6. **Use the website**<br>
    Head to http://localhost:3000/ in your browser to start using WhatTheNote


## Backend
**Backend Tech Stack Includes:**
- FastAPI (Python 3.13+)
- MongoDB (hosted on an external server)
- Groq API (Cloud LLM inference)
- Pydantic (Validation)
- bcrypt (Password hashing)

**Backend Directory Structure:**
```sh
backend/
├── app
│   ├── core
│   │   └── utils.py
│   ├── llm
│   │   ├── groq.py
│   │   └── prompts.py
│   ├── main.py
│   ├── routers
│   │   ├── documents.py
│   │   └── users.py
│   ├── schemas
│   │   ├── document_schemas.py
│   │   ├── query_schemas.py
│   │   ├── token_schema.py
│   │   └── user_schemas.py
│   ├── services
│   │   ├── auth.py
│   │   └── database
│   │       ├── core.py
│   │       ├── documents.py
│   │       └── user.py
│   └── tests
│       ├── integration
│       │   └── test_api_integration.py
│       └── unit
│           ├── routers
│           │   ├── conftest.py
│           │   ├── test_documents.py
│           │   └── test_users.py
│           └── services
│               ├── conftest.py
│               ├── test_auth.py
│               └── test_db.py
├── Dockerfile
└── requirements.txt
```


## Frontend
**Frontend Tech Stack Includes:**
- React
- NodeJS (20+)
- TypeScript
- Tailwind CSS
- React Router

**Frontend Directory Structure:**
```sh
frontend/
├── config
│   ├── eslint.config.js
│   ├── tailwind.config.ts
│   └── vite.config.ts
├── Dockerfile
├── index.html
├── json_config
│   ├── components.json
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   └── tsconfig.node.json
├── nginx
│   └── nginx.conf
├── package-lock.json
├── package.json
├── postcss.config.js
├── public
│   └── logo1.png
└── src
    ├── App.css
    ├── App.tsx
    ├── components
    │   ├── dashboard
    │   │   ├── DashboardHeader.tsx
    │   │   ├── DocumentGrid.tsx
    │   │   ├── DocumentTabs.tsx
    │   │   ├── NoDocumentsFound.tsx
    │   │   ├── SearchFilters.tsx
    │   │   └── SubjectGrouping.tsx
    │   ├── layout
    │   │   ├── Footer.tsx
    │   │   └── Navbar.tsx
    │   └── ui
    │       ├── accordion.tsx
    │       ├── alert-dialog.tsx
    │       ├── alert.tsx
    │       ├── AnimatedLogo.tsx
    │       ├── aspect-ratio.tsx
    │       ├── avatar.tsx
    │       ├── badge.tsx
    │       ├── breadcrumb.tsx
    │       ├── button.tsx
    │       ├── calendar.tsx
    │       ├── card.tsx
    │       ├── carousel.tsx
    │       ├── chart.tsx
    │       ├── checkbox.tsx
    │       ├── collapsible.tsx
    │       ├── command.tsx
    │       ├── context-menu.tsx
    │       ├── dialog.tsx
    │       ├── DocumentCard.tsx
    │       ├── drawer.tsx
    │       ├── dropdown-menu.tsx
    │       ├── FeatureCard.tsx
    │       ├── FileUpload.tsx
    │       ├── form.tsx
    │       ├── hover-card.tsx
    │       ├── input-otp.tsx
    │       ├── input.tsx
    │       ├── label.tsx
    │       ├── menubar.tsx
    │       ├── navigation-menu.tsx
    │       ├── pagination.tsx
    │       ├── popover.tsx
    │       ├── progress.tsx
    │       ├── radio-group.tsx
    │       ├── resizable.tsx
    │       ├── scroll-area.tsx
    │       ├── select.tsx
    │       ├── separator.tsx
    │       ├── sheet.tsx
    │       ├── sidebar.tsx
    │       ├── skeleton.tsx
    │       ├── slider.tsx
    │       ├── sonner.tsx
    │       ├── switch.tsx
    │       ├── table.tsx
    │       ├── tabs.tsx
    │       ├── textarea.tsx
    │       ├── toast.tsx
    │       ├── toaster.tsx
    │       ├── toggle-group.tsx
    │       ├── toggle.tsx
    │       ├── tooltip.tsx
    │       └── use-toast.ts
    ├── hooks
    │   ├── use-mobile.tsx
    │   └── use-toast.ts
    ├── index.css
    ├── lib
    │   ├── api.ts
    │   ├── AuthContext.tsx
    │   └── utils.ts
    ├── main.tsx
    ├── pages
    │   ├── Dashboard.tsx
    │   ├── DocumentView.tsx
    │   ├── Index.tsx
    │   ├── Login.tsx
    │   ├── NotFound.tsx
    │   ├── SignUp.tsx
    │   ├── Upload.tsx
    │   └── UserProfile.tsx
    ├── types
    │   ├── document.ts
    │   └── user.ts
    └── vite-env.d.ts
```


## Groq Service
**Groq Service Directory Structure:**
```sh
groq_service/
├── app
│   ├── core
│   │   └── prompts.py
│   ├── main.py
│   ├── routes
│   │   └── groq_routes.py
│   └── schemas
│       └── groq_schema.py
├── Dockerfile
└── requirements.txt
```


## Key Components
- **[`backend/app/llm/groq.py`](backend/app/llm/groq.py)**: Handles async calls to the Groq LLM service for text cleanup and querying.
- **[`backend/app/llm/prompts.py`](backend/app/llm/prompts.py)**: Contains prompt templates for summarization, querying, and cleanup.
- **[`groq_service/app/routes/groq_routes.py`](groq_service/app/routes/groq_routes.py)**: FastAPI endpoints for Groq LLM operations.
- **[`frontend/src/pages/DocumentView.tsx`](frontend/src/pages/DocumentView.tsx)**: Main UI for viewing, querying, and interacting with documents.
- **[`docker-compose.yml`](docker-compose.yml)**: Orchestrates backend, frontend, and Groq service containers.


## Additional Notes
PDFs are processed securely; only authenticated users can access their documents.
LLM calls are routed via the Groq service for fast, scalable inference.
Markdown rendering ensures readable, well-formatted document content.
