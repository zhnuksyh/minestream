# MineStream: AI Voice Synthesis Terminal

MineStream is a local-first AI voice generation tool powered by **Qwen3-TTS** (Dual-Model Architecture). It enables high-fidelity text-to-speech with customizable voice personas, dynamic text prompts, and zero-shot voice cloning.

## 🚀 Current Status

| Component | Status | Notes |
|-----------|--------|-------|
| Frontend (Vite + React + TS) | ✅ Working | Includes Toasts, Avatars, Visualizers |
| Backend (FastAPI + SQLite) | ✅ Working | HTTPS enabled for mobile support |
| **Voice Cloning** | ✅ **Active** | Powered by `Qwen3-Base` (Zero-Shot) |
| Voice Design (Prompts) | ✅ Active | Powered by `Qwen3-VoiceDesign` |
| Audio Pipeline | ✅ Optimized | Auto-converts WebM/MP3 to 24kHz WAV |

## ✨ Features

- **Hybrid Voice Engine**:
    - **Library Mode**: Use preset voices or cloned voices.
    - **Prompt Mode**: Describe a voice ("A rusty old pirate") to generate it on the fly.
    - **Cloning Mode**: Upload *any* audio sample (3-10s) to clone a voice instantly.
- **Secure & Mobile Ready**: Runs on HTTPS to support microphone access on external devices.
- **Robust Audio Handling**: Backend automatically normalizes upload formats using `ffmpeg`.

## 📚 Documentation
- [**The Journey**](docs/JOURNEY.md) - Challenges encountered & Rebuild Guide.
- [**Hardware Guide**](docs/HARDWARE.md) - Running on AMD/Mac/CPU.

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React, Vite, TypeScript, Tailwind CSS, Lucide |
| **Backend** | FastAPI, SQLAlchemy, SQLite, Pydantic |
| **AI Models** | `Qwen3-VoiceDesign` (Prompts) + `Qwen3-Base` (Cloning) |
| **Audio** | `ffmpeg` (pydub), `torchaudio`, Web Audio API |

## ⚡ Quick Start

### 1. Prerequisites
- **NVIDIA GPU** (Recommended: 12GB+ VRAM). *See Hardware Guide for others.*
- **System Tools**: `ffmpeg` (Required for audio conversion).

### 2. Backend Setup
```bash
# Install Python dependencies
pip install -r requirements.txt

# Start the Secure API Server (Auto-generates SSL)
./scripts/start-https.sh
# Server runs on https://0.0.0.0:8000
```

### 3. Frontend Setup
```bash
# Install JS dependencies
npm install

# Start Dev Server
npm run dev
# App runs on https://localhost:5173
```

## 📂 Project Structure

```
minestream/
├── app/                    # FastAPI Backend
│   ├── api/v1/             # Endpoints (tts, cloning w/ auto-convert)
│   ├── services/           # Dual-Model Loader & Audio Processing
├── src/                    # React Frontend
│   ├── components/         # UI (VoiceVault, AudioRecorder, Toasts)
│   ├── store/              # Zustand Store
├── scripts/                # Utility scripts (start-https, seed)
├── docs/                   # Extended Documentation
└── vault/                  # Audio storage (uploads/outputs)
```

## ⚠️ Important Notes
- **First Run**: The backend will download ~7GB of models (VoiceDesign + Base). Ensure you have disk space.
- **Microphone**: You must access the app via **HTTPS** (or localhost) for the mic to work.
- **Performance**: Install `flash-attn` for 2x faster inference (Optional).

## License
MIT
