import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "MineStream Neural Engine"
    API_V1_STR: str = "/api/v1"
    
    # Paths
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    UPLOAD_DIR: str = os.path.join(BASE_DIR, "vault/voices")
    OUTPUT_DIR: str = os.path.join(BASE_DIR, "vault/generated")
    
    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./minestream.db"
    
    # AI Models
    # VoiceDesign model for text-prompt based voice synthesis
    TTS_MODEL_PATH: str = "Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign"
    # Base model for voice cloning from reference audio
    TTS_CLONE_MODEL_PATH: str = "Qwen/Qwen3-TTS-12Hz-1.7B-Base"
    USE_GPU: bool = True
    QUANTIZATION: str = "fp16" # options: fp16, int8, or none

    class Config:
        env_file = ".env"

settings = Settings()

# Ensure directories exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.OUTPUT_DIR, exist_ok=True)
