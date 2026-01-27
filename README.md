# MineStream: Universal AI Gaming Narrator

MineStream is a modular, high-fidelity AI commentary tool for game creators. It uses local Neural Synthesis (Qwen3-TTS) to generate dynamic, context-aware narration for Minecraft, FPS, RPGs, and more.

## Architecture

This project has been refactored from a single-file prototype into a scalable Vite + React + TypeScript architecture.

### Directory Structure

```
src/
├── components/         # React components
│   ├── ui/             # Reusable UI primitives (Button, Card, etc.)
│   ├── GameSelector    # Context switcher for game tone
│   ├── ScriptEditor    # Main TTS input interface
│   ├── VoiceVault      # Library of cloned voices
│   └── AudioRecorder   # Voice capture with visualizer
├── hooks/              # Custom React hooks
│   ├── useMicrophone   # Web Audio API abstraction
│   └── useWaveSurfer   # Waveform visualization wrapper
├── services/           # API abstraction layer (currently mock)
├── store/              # Zustand state management
└── types.ts            # Shared TypeScript interfaces
```

## Setup & Development

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Start Development Server:**
    ```bash
    npm run dev
    ```

3.  **Build for Production:**
    ```bash
    npm run build
    ```

## Features

-   **Game Context Awareness:** Switch between "Minecraft", "FPS", "RPG" modes to adjust AI tone.
-   **Neural Voice Cloning:** Capture 10s audio samples to clone voices locally.
-   **Waveform Visualization:** Real-time microphone input and TTS output visualization using `wavesurfer.js`.
-   **Voice Vault:** persistent library of voice profiles (mocked state).

## Tech Stack

-   **Frontend:** React, Vite, TypeScript
-   **Styling:** Tailwind CSS (Premium "Dark Gaming Dashboard" aesthetic)
-   **State:** Zustand
-   **Audio:** Web Audio API, Wavesurfer.js
-   **Icons:** Lucide React

## Backend Integration

The frontend connects to a service layer in `src/services/api.ts`. Currently, this is mocked. To integrate with the FastAPI Python backend:

1.  Update `src/services/api.ts` to `fetch` from your local Python server (e.g., `http://localhost:8000`).
2.  Ensure `POST /generate` and `POST /clone` endpoints match the types in `src/types.ts`.
