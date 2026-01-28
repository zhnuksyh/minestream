import os
import uuid
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models.voice import VoiceProfile
from app.services.audio_service import AudioService
from app.core.config import settings

router = APIRouter()

@router.post("/extract")
async def extract_voice(
    audio: UploadFile = File(...),
    name: str = Form(...),
    tag: str = Form(...),
    db: AsyncSession = Depends(get_db)
):
    """
    Extracts voice features from an uploaded audio file.
    """
    try:
        # 1. Generate ID and Paths
        voice_id = uuid.uuid4().hex[:8]
        filename = f"{voice_id}.wav"
        file_path = os.path.join(settings.UPLOAD_DIR, filename)
        
        # 2. Save Audio File
        contents = await audio.read()
        AudioService.save_upload(contents, file_path)
        
        # 3. Create Database Entry
        # Real logic would also run inference here to get the 'embedding' .pt file
        new_voice = VoiceProfile(
            id=voice_id,
            name=name,
            tag=tag,
            file_path=file_path
        )
        
        db.add(new_voice)
        await db.commit()
        await db.refresh(new_voice)
        
        return {
            "status": "cloned",
            "voice": new_voice.to_dict()
        }
        
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

from sqlalchemy.future import select
@router.get("/list")
async def list_voices(db: AsyncSession = Depends(get_db)):
    """
    Returns a list of all available voice profiles.
    """
    result = await db.execute(select(VoiceProfile))
    voices = result.scalars().all()
    return {"voices": [v.to_dict() for v in voices]}
