# MineStream: AI Voice Synthesis Terminal

MineStream is a local-first AI voice generation tool powered by **Qwen3-TTS**. It enables high-fidelity text-to-speech with customizable voice personas—either from a preset library or via dynamic text descriptions.

## Current Status

| Component | Status |
|-----------|--------|
| Frontend (Vite + React + TS) | ✅ Working |
| Backend (FastAPI + SQLite) | ✅ Working |
| AI Engine (Qwen3-TTS 1.7B) | ✅ Integrated |
| Voice Presets (Library Mode) | ✅ Working |
| Dynamic Voice Prompts | ✅ Working |
| Voice Cloning (Upload) | 🚧 UI Only |

## Features

- **Text-to-Speech**: Type any text and generate audio using Qwen3-TTS.
- **Voice Library**: Select from preset voice personas (Epic Narrator, Cyber System, Whispering Shadow).
- **Dynamic Prompting**: Describe any voice in natural language (e.g., *"A tired old wizard mumbling spells"*).
- **Waveform Playback**: Visual audio player with download support.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Vite, TypeScript, Tailwind CSS |
| State | Zustand |
| Audio | Web Audio API, WaveSurfer.js |
| Backend | FastAPI, SQLAlchemy, SQLite |
| AI Model | `Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign` via `qwen-tts` |

## Quick Start

### 1. Backend
```bash
# Install Python dependencies
pip install -r requirements.txt

# Start the API server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# (Optional) Seed default voices
python scripts/seed_voices.py
```

### 2. Frontend
```bash
# Install JS dependencies
npm install

# Start dev server
npm run dev
```

### 3. Open App
Navigate to `http://localhost:5173`

## Project Structure

```
minestream/
├── app/                    # FastAPI Backend
│   ├── api/v1/             # REST endpoints (tts, cloning)
│   ├── core/               # Config, database setup
│   ├── models/             # SQLAlchemy models
│   └── services/           # TTS inference logic
├── src/                    # React Frontend
│   ├── components/         # UI components
│   ├── services/           # API client
│   └── store/              # Zustand state
├── scripts/                # Utility scripts
│   └── seed_voices.py      # Populate default voices
└── vault/                  # Audio storage (uploads/outputs)
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/tts/generate` | Generate audio from text |
| GET | `/api/v1/clone/list` | List all voice profiles |
| POST | `/api/v1/clone/extract` | Upload audio for cloning (WIP) |
| GET | `/audio/download/{filename}` | Serve generated audio files |
| GET | `/health` | Health check |

## License

MIT
