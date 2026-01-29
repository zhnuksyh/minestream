# MineStream: The Journey & Rebuild Guide

**Created:** January 29, 2026  
**Purpose:** To document the "stuck times" (challenges), key learnings, and providing a "Golden Path" for rebuilding this project from scratch.

---

## 🛑 The "Stuck Times" (Challenges & Pivots)

During development, we encountered several critical roadblocks. If you are debugging or forking, **read this first**.

### 1. Microphone Access & HTTPS (The "Security" Block)
*   **Problem:** We wanted to test on mobile/external devices, so we hosted on `0.0.0.0`. However, browsers **block microphone access** on insecure HTTP origins (except `localhost`).
*   **The Struggle:** Microphone APIs simply threw errors or returned nothing on remote devices.
*   **Solution:** We created a dedicated script (`start-https.sh`) to:
    1.  Generate self-signed SSL certificates (`openssl`).
    2.  Configure Vite to serve HTTPS.
    3.  Configure Uvicorn (FastAPI) to serve HTTPS.
    *   *Lesson:* Voice apps MUST run on HTTPS from day one if testing remotely.

### 2. The Model Mismatch (VoiceDesign vs. Base)
*   **Problem:** We tried to implement Voice Cloning using the `Qwen3-TTS-VoiceDesign` model. It accepted the audio but just "hallucinated" a generic voice or ignored the reference.
*   **The Epiphany:** We discovered deeper in the docs that **VoiceDesign** is optimized for *Text Prompts* (e.g., "A deep pirate voice"), while **Qwen3-Base** is the model that supports *Zero-Shot Cloning* from reference audio.
*   **Solution:** We implemented a **Dual-Model Architecture**.
    *   `VoiceDesign` for prompt-based generation.
    *   `Base` for cloning.
    *   *Trade-off:* Higher VRAM usage (~8GB total), but full feature set.

### 3. Audio Format Hell (WebM vs. WAV)
*   **Problem:** Browsers (MediaRecorder API) record mostly in **WebM** or **Ogg**. PyTorch/Torchaudio and the Qwen model strictly expect **WAV** (often 24kHz).
*   **The Struggle:** Uploads would crash the backend with "header missing" or "unknown format" errors.
*   **Solution:** We added a robust middleware layer using `ffmpeg` and `pydub`.
    *   *Flow:* Receive Bytes -> `AudioSegment.from_file(io.BytesIO)` (handles WebM) -> Export as `24000Hz Mono WAV` -> Save to Disk.

### 4. Dependency Nightmares (Flash Attention)
*   **Problem:** `flash-attn` is required for maximum inference speed but has very long build times (10-20 mins) and strict CUDA version requirements.
*   **Solution:** We verified that the app runs fine (just slower) without it. We made it an *optional* optimization rather than a blocker.

---

## 🛠️ Rebuild Guide: The "Golden Path"

If you were to build MineStream V2 from scratch today, here is the optimal path.

### 1. The Stack
*   **Frontend:** React + Vite + Tailwind + Lucide (UI).
*   **Backend:** FastAPI (Python 3.10+).
*   **AI Engine:** Qwen2.5-Math (optional logic) + Qwen3-TTS (Audio).
*   **Database:** SQLite + SQLAlchemy (Async).

### 2. Prerequisites
1.  **System:** Linux/WSL with NVIDIA GPU (24GB VRAM recommended for dual models, 12GB min).
2.  **Tools:** `ffmpeg` (CRITICAL for audio), `node` (Frontend), `conda` (Python env).

### 3. Step-by-Step Implementation

#### Phase A: Environment & Certs
Don't wait. Set up HTTPS immediately.
```bash
# Generate certs
mkdir certs
openssl req -x509 -newkey rsa:4096 -keyout certs/key.pem -out certs/cert.pem -days 365 -nodes
```

#### Phase B: Backend Core
Install dependencies first to avoid build waits later.
```bash
pip install torch torchaudio transformers accelerate fastapi uvicorn[standard] python-multipart sqlalchemy aiosqlite pydub
# distinct step for flash-attn if you have time
pip install flash-attn --no-build-isolation
```

#### Phase C: The Audio Pipeline (The Secret Sauce)
Write your `AudioService` class *before* the API.
```python
# Pseudo-code pattern
def save_upload(file_bytes):
    from pydub import AudioSegment
    audio = AudioSegment.from_file(io.BytesIO(file_bytes)) # Handles WebM
    audio = audio.set_frame_rate(24000).set_channels(1)
    audio.export("output.wav", format="wav")
```

#### Phase D: Model Loader
Implement a Singleton loader that checks VRAM.
```python
class ModelLoader:
    def verify_vram(self):
        # If < 8GB, load only ONE model
        pass
```

### 4. Critical Files to Copy
If migrating, keep these safe:
*   `requirements.txt`
*   `scripts/start-https.sh`
*   `app/services/audio_service.py` (The conversion logic)
*   `src/store/useStore.ts` (State management pattern)

---

**Final Thought:** The hardest part wasn't the AI—it was the **plumbing** (Audio Formats, SSL, State Management). Build the plumbing robustly first, and the AI features are easy to plug in.
