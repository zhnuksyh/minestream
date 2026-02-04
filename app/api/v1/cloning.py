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

@router.post("/lock")
async def lock_voice(
    audio: UploadFile = File(...),
    name: str = Form(...),
    prompt: str = Form(None),  # Original prompt used to generate this voice
    db: AsyncSession = Depends(get_db)
):
    """
    Lock a preview voice by saving the audio as a reference.
    Future generations with this voice will use clone mode for consistency.
    """
    try:
        # 1. Generate ID and Paths
        voice_id = uuid.uuid4().hex[:8]
        filename = f"locked_{voice_id}.wav"
        file_path = os.path.join(settings.UPLOAD_DIR, filename)
        
        # 2. Save Audio File (auto-converts to WAV)
        contents = await audio.read()
        AudioService.save_upload(contents, file_path)
        
        # 3. Create Database Entry with type="locked"
        new_voice = VoiceProfile(
            id=voice_id,
            name=name,
            tag="Locked",
            type="locked",
            prompt=prompt,
            file_path=file_path
        )
        
        db.add(new_voice)
        await db.commit()
        await db.refresh(new_voice)
        
        return {
            "status": "locked",
            "voice": new_voice.to_dict()
        }
        
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

from fastapi.responses import FileResponse

@router.get("/download/{voice_id}")
async def download_voice(voice_id: str, db: AsyncSession = Depends(get_db)):
    """
    Download the audio file for a cloned/locked voice.
    """
    result = await db.execute(select(VoiceProfile).where(VoiceProfile.id == voice_id))
    voice = result.scalars().first()
    
    if not voice:
        raise HTTPException(status_code=404, detail="Voice not found")
    
    if not voice.file_path or not os.path.exists(voice.file_path):
        raise HTTPException(status_code=404, detail="Audio file not found")
    
    # Return file with proper filename for download
    filename = f"{voice.name.replace(' ', '_')}.wav"
    return FileResponse(
        voice.file_path,
        media_type="audio/wav",
        filename=filename,
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
