import os
import uuid
import time
import torch
import uvicorn
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

# --- Mock Qwen3-TTS Integration ---
# In a real setup, you would import the specific Qwen model classes
# from transformers or the official Qwen-Audio repository.
# Example: from models import Qwen3TTS

app = FastAPI(title="MineStream Neural Engine")

# Enable CORS for your Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Configuration ---
UPLOAD_DIR = "vault/voices"
OUTPUT_DIR = "vault/generated"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Check for GPU
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
print(f"--- MineStream Booting on {DEVICE} ---")

# --- Data Models ---
class VoiceProfile(BaseModel):
    id: str
    name: str
    tag: str
    created_at: float

class TTSRequest(BaseModel):
    text: str
    voice_id: Optional[str] = None
    voice_prompt: Optional[str] = None
    speed: float = 1.0

# --- API Endpoints ---

@app.post("/tts/generate")
async def generate_audio(request: TTSRequest):
    """
    Takes text and a voice reference to generate speech.
    If voice_id is provided, it uses the saved embedding.
    If voice_prompt is provided, it uses Qwen's Voice Design (Zero-shot).
    """
    try:
        start_time = time.time()
        output_filename = f"gen_{uuid.uuid4().hex}.wav"
        output_path = os.path.join(OUTPUT_DIR, output_filename)

        # LOGIC FLOW:
        # 1. Load the reference embedding based on voice_id or description.
        # 2. Run Qwen3-TTS inference.
        # 3. Save the resulting tensor as a .wav file using torchaudio or soundfile.
        
        # MOCK INFERENCE:
        print(f"Synthesizing: {request.text[:30]}...")
        time.sleep(0.5) # Simulate GPU work
        
        generation_time = time.time() - start_time
        return {
            "status": "success",
            "audio_url": f"/audio/download/{output_filename}",
            "latency": f"{generation_time:.2f}s"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/clone/extract")
async def extract_voice(audio: UploadFile = File(...), name: str = Form(...), tag: str = Form(...)):
    """
    Receives a 3-10 second audio clip from the React frontend.
    Extracts the speaker embedding and saves it to the Vault.
    """
    voice_id = str(uuid.uuid4().hex[:8])
    file_path = os.path.join(UPLOAD_DIR, f"{voice_id}.wav")
    
    with open(file_path, "wb") as buffer:
        buffer.write(await audio.read())
    
    # LOGIC FLOW:
    # 1. Load audio into memory.
    # 2. Use Qwen's encoder to extract voice features (prosody, timbre).
    # 3. Save features to a manifest/database (SQLite or JSON).

    return {
        "id": voice_id,
        "name": name,
        "tag": tag,
        "status": "cloned"
    }

@app.get("/voices", response_model=List[VoiceProfile])
async def list_voices():
    """Returns all saved voice clones in the Vault."""
    # This would typically read from a SQLite database
    return [
        {"id": "z1", "name": "Zahin_Main", "tag": "Natural", "created_at": time.time()},
        {"id": "z2", "name": "Zahin_Excited", "tag": "Gaming", "created_at": time.time()},
    ]

@app.get("/audio/download/{filename}")
async def download_audio(filename: str):
    """Serves the generated audio file to the frontend."""
    file_path = os.path.join(OUTPUT_DIR, filename)
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="audio/wav")
    raise HTTPException(status_code=404, detail="File not found")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)