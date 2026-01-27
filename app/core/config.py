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
    # Default to a local path or huggingface id
    TTS_MODEL_PATH: str = "Qwen/Qwen2-Audio-7B-Instruct"  # Placeholder for Qwen3-TTS when available
    USE_GPU: bool = True
    QUANTIZATION: str = "fp16" # options: fp16, int8, or none

    class Config:
        env_file = ".env"

settings = Settings()

# Ensure directories exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.OUTPUT_DIR, exist_ok=True)
