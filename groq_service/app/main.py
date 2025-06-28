from fastapi import FastAPI
from app.routes.groq_routes import router as groq_router

app = FastAPI()
app.include_router(groq_router)


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "backend"}
