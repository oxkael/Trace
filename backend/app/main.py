from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .api.routes import router as api_router
from .clients.bitget import bitget_client

app = FastAPI(
    title=settings.APP_NAME,
    description="Event-aware trading & research assistant for 24/7 tokenized US stocks (Bitget rTokens)",
    version="1.0.0"
)

# CORS middleware for local frontend Vite server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routes under /api
app.include_router(api_router, prefix="/api")

from .db.database import init_db

@app.on_event("startup")
async def startup_event():
    init_db()

@app.on_event("shutdown")
async def shutdown_event():
    await bitget_client.close()

@app.get("/")
async def root():
    return {
        "app": settings.APP_NAME,
        "status": "online",
        "docs": "/docs",
        "health": "/api/health"
    }
