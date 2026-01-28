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

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.models.voice import VoiceProfile

@router.post("/generate")
async def generate_speech(request: TTSRequest, db: AsyncSession = Depends(get_db)):
    """
    Generate speech from text using Qwen3-TTS.
    """
    try:
        # Lookup Voice Instruction if ID provided
        instruction = None
        ref_audio_path = None
        
        # Priority 1: Direct Voice Prompt (Dynamic Mode)
        if request.voice_prompt:
            instruction = request.voice_prompt
            
        # Priority 2: Database Lookup by ID (Library/Clone Mode)
        elif request.voice_id:
            result = await db.execute(select(VoiceProfile).where(VoiceProfile.id == request.voice_id))
            voice_profile = result.scalars().first()
            if voice_profile:
                # Check if this is a cloned voice (has reference audio)
                if voice_profile.file_path and os.path.exists(voice_profile.file_path):
                    ref_audio_path = voice_profile.file_path
                # Otherwise use prompt-based generation
                elif voice_profile.prompt:
                    instruction = voice_profile.prompt
        
        # 1. Generate Audio (clone or synthesize)
        if ref_audio_path:
            # Voice Cloning Mode
            audio_data = tts_service.clone(
                text=request.text,
                ref_audio_path=ref_audio_path,
                speed=request.speed
            )
        else:
            # Voice Design Mode (text prompt)
            audio_data = tts_service.generate(
                text=request.text, 
                voice_embedding=request.voice_id, 
                instruction=instruction,
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
