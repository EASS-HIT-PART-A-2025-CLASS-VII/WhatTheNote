# WhatTheNote
A full-stack application that transforms PDF documents into interactive, AI-powered knowledge bases. It leverages Groq LLM for summarization, querying, and content cleanup, providing a seamless experience for document management and exploration.

## Features
- 📄 **PDF Upload & Extraction**: Upload PDF files and extract their content.
- 🧠 **AI Summarization**: Generate concise summaries and metadata using LLMs.
- 🔍 **Smart Querying**: Ask questions about your documents and get context-aware answers.
- 🪄 **AI Content Cleanup**: Convert raw PDF text into clean, readable Markdown.
- 📁 **Document Management**: Organize, view, and filter your documents.
- 🔒 **Authentication**: Secure user login and document access.
- 📊 **Dashboard**: Visualize and interact with your document collection.


## Video Demo



## Project Directory Structure

```sh
WhatTheNote/
├── backend
├── frontend
├── groq_service
└── README.md
```

![Architecture](https://i.imgur.com/DFuQmcI.png)


## Running the Project with Docker

1. **Clone the repository**
    ```sh
    git clone https://github.com/yourusername/whatthenote.git
    cd whatthenote
    ```

2. **Get a Groq API Key**
    - Sign up at [Groq Console](https://console.groq.com/).

3. **Configure Environment Variables**
    - Create a `.env` file in the root.
    - Set Groq service URL and your Groq API key:
      ```
      GROQ_API_KEY=your_groq_api_key
      GROQ_SERVICE_URL=http://groq:9000
      ```

4. **Start All Services**
    ```sh
    docker-compose up --build
    ```
    - Backend
    - Frontend
    - Groq Service


## Backend

**Backend Tech Stack:**
- [FastAPI](https://fastapi.tiangolo.com/) (Python 3.13+)
- [MongoDB](https://www.mongodb.com/) (Document storage, **hosted on an external server**)
- [Groq API](https://console.groq.com/) (Cloud LLM inference)
- [Pydantic](https://docs.pydantic.dev/) (Validation)
- [bcrypt](https://pypi.org/project/bcrypt/) (Password hashing)

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

**Frontend Tech Stack**
- [React](https://react.dev/) (20+)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) (UI components)
- [React Router](https://reactrouter.com/)
- [Axios](https://axios-http.com/) (API calls)
- [react-markdown](https://github.com/remarkjs/react-markdown) (Markdown rendering)

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
