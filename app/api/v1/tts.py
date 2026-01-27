import uuid
import os
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from app.services.tts_service import tts_service
from app.core.config import settings

router = APIRouter()

class TTSRequest(BaseModel):
    text: str
    voice_id: Optional[str] = None
    voice_prompt: Optional[str] = None
    speed: float = 1.0

@router.post("/generate")
async def generate_speech(request: TTSRequest):
    """
    Generate speech from text using Qwen3-TTS.
    """
    try:
        # 1. Generate Audio
        audio_data = tts_service.generate(
            text=request.text, 
            voice_embedding=request.voice_id, # Simplified passing ID as embedding lookup key
            speed=request.speed
        )
        
        # 2. Save to Output Directory
        filename = f"gen_{uuid.uuid4().hex}.wav"
        output_path = os.path.join(settings.OUTPUT_DIR, filename)
        
        with open(output_path, "wb") as f:
            f.write(audio_data)
            
        # 3. Return URL
        return {
            "status": "success",
            "audio_url": f"/audio/download/{filename}",
            "text_processed": request.text
        }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
