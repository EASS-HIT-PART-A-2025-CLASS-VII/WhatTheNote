# WhatTheNote
<div align="center">
A full-stack application that transforms PDF documents into interactive, AI-powered knowledge bases. It leverages Groq LLM for summarization, querying, and content cleanup, providing a seamless experience for document management and exploration.

<br>[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com)
[![Groq AI](https://img.shields.io/badge/Groq-%23f44f34?style=for-the-badge&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMkAAADJCAMAAAC+GOY3AAAAM1BMVEX1TzX////4e2j6p5r+9PL2WkL5kYH3cFv+6eb7vbP908393tn2ZU77sqf8yMD5nI34hnTZv6T1AAAFCUlEQVR4nO2c23rjIAyEXeND4sRJ3v9pN4e2m0Vgg0cs43ya69bWH5CQEai5tp+hY9M2nyFnJHQyEj4ZCZ+MhE9Gwicj4ZOR8MlI+GQkfDISPhkJn4yET0bCJyPhk5HwyUj4ZCR8MhI+GUmS+tbN09R9PXSYJjeU/NWKkfS34+FLanJjmfeVIrldAhTfOsxFYEqQ9K6Lczx1GtRfWoCkP65gvAZGnUWbZH08flluqi/WJmlDXh7TdNZ8tSpJP2dw3NVpTjFNkjFnQF469mpvVyQZUj3kXSe1iKxH4jZw3NVpoaiRJMXeIIpSDNMi2Qxyl47fK5EgIEoTTIfkioAooaiQ3DCQ+3qvEIw1SM7x8NtdXPv6wdubm+IoE2yECskphiHS93iy72ArFEgiC0k42z3HMkzYVXCSMTwe19jfR7L+E2iGAklwbl2WXDicMKPzCyYZQlZFB+Sl4LB0YPyCSQK/b8LyEPKtI2YIShIYkqR1LjSU2IcXSiKHJHHBDqDMkCUgScCe1OdJX8E8BSSRy3Z6CJJBD0qKMZKzMCYj7ZBJDrSmYCQyB87xWuy/fWEkYoLkLW8iXKysQ4uCSMTkyvTZVnN6QSQicuVmHGJQgOgFkYhAmjvPxU8BGAOR+D/pJfcBPTqob4JIfDvy1wP/ywv4dkRIhMPmB1F/eh02GwOR+BsRG8wQn2mbjYFI/NQ8200aOUG3r42aJFvc1U/cAGsAEj8Ib1mhOUg0rPDH1UiM5KXPIfEX6C0ez0GiEYU5SbasjBwkGkkTB4lCBklCopDVs5DAX1o0JPDXLw2J2LDKj8MkJOguUUNDInd5sgeFhUSc5+pyPYWFRFZLczdHWEgClYPMNJKGJFAJyius05A08pxA3nEaHpJAETcLhYekDxzeyEHhIQke7co4EEhEEjpa8PU1py72TCTiK+Wp1LPmTCRyoX9pSnowFUkfO6l2uK7nLlQkzRg/PXiaV240cZGET0bF9f5GMpKYq+yQJO/kMzVJFgo3SQ4KOUkGCjtJegSjJ2naxEtB/CRNv3CzdF8kiXe1dkGSdBFwHyRNc14NYnshebAsz7H9kNzn2BDL9PdGctd5uMRG5v2N/lQkJHloHNxP84WYtRznVjTkz8L9kvjjtf1JlUnExsz2R1Um8UNXpROdCvLdBLgXVJdEFCqBg/V1SUSSBtxqrEoiNvo74GFVSUTxBbk+V5NE1l6Q6001SWT6j1w5q0gib9VDdzPrkQRu1UOmVCMJ1CqAiw5NPZJQ0QXr8VGAZJzWHTcEgg1JAZKxWy9jB8tgYNsVdZJngWulCVRwsxJtWqBN8lOpW2haENkSQ+1QJvlbcuxchGUI98bCrpQ32iT/1E5DLH2EQ6F3jCqJKAJfhvc6dj/Et/RwK1R7qoXsPEzOtW3r3GVpMw+5uvwtRZKFsvyawGYYT+mRACAnjW53aiS1QfRIFhpB/ReQKrXfIiCaHr8NZbGDUY40o3DmQZyn4KX9V7orY26TTq0Oig/pZiuJZewfqbaA1c6FM5rZqvZ/LfGlldhgOJorb36v/tdvSrPkblbtLfxQkR2J5dLv46in8ng8VGpvZZxjDlOoNXrJXaLzIDrWHy7XUu3qi+93tTfn3DRNs3O3tsCc+qvatV89GQmfjIRPRsInI+GTkfDJSPhkJHwyEj4ZCZ+MhE9Gwicj4ZOR8MlI+GQkfDISPhkJn4yET59EcnSfoekPn2IoKBZqX6sAAAAASUVORK5CYII=)](https://groq.com/)
[![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)](https://nginx.org/)
    
<img src="https://i.postimg.cc/pLSWWtm2/What-The-Note-seamless-sharpened.png" alt="Logo" />
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
    git clone https://github.com/EASS-HIT-PART-A-2025-CLASS-VII/WhatTheNote.git
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


## Frontend
**Frontend Tech Stack Includes:**
- React
- NodeJS (20+)
- TypeScript
- Tailwind CSS
- React Router


## Additional Notes
PDFs are processed securely; only authenticated users can access their documents.
LLM calls are routed via the Groq service for fast, scalable inference.
Markdown rendering ensures readable, well-formatted document content.
