import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import init_db
from app.services.tts_service import tts_service
from app.api.v1 import tts, cloning

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    tts_service.initialize_model()
    yield
    # Shutdown
    # clean up resources if needed

app = FastAPI(
    title=settings.PROJECT_NAME, 
    lifespan=lifespan
)

# CORS checks
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(tts.router, prefix=f"{settings.API_V1_STR}/tts", tags=["TTS"])
app.include_router(cloning.router, prefix=f"{settings.API_V1_STR}/clone", tags=["Cloning"])

@app.get("/audio/download/{filename}")
async def download_audio(filename: str):
    """Serves the generated audio file."""
    file_path = os.path.join(settings.OUTPUT_DIR, filename)
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="audio/wav")
    return JSONResponse(status_code=404, content={"detail": "File not found"})

@app.get("/health")
async def health_check():
    return {"status": "ok", "device": "cuda" if settings.USE_GPU else "cpu"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
