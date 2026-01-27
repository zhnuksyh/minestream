import torch
import time
from app.core.config import settings
import logging

# Set up logging
logger = logging.getLogger("uvicorn")

class TTSService:
    _instance = None
    _model = None
    _processor = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(TTSService, cls).__new__(cls)
        return cls._instance

    def initialize_model(self):
        """
        Loads the Qwen3-TTS model into VRAM. 
        This is called once during app startup.
        """
        if self._model is not None:
             return
            
        logger.info(f"Loading Qwen-TTS model from {settings.TTS_MODEL_PATH}...")
        try:
            # --- MOCK LOADING FOR NOW ---
            # Real implementation would be:
            # self.processor = AutoProcessor.from_pretrained(settings.TTS_MODEL_PATH)
            # self.model = Qwen2AudioForConditionalGeneration.from_pretrained(...)
            
            time.sleep(1) # Simulate load time
            self._model = "MOCK_MODEL_LOADED"
            
            device_str = "CUDA" if torch.cuda.is_available() and settings.USE_GPU else "CPU"
            logger.info(f"Model loaded successfully on {device_str}")
        except Exception as e:
            logger.error(f"Failed to load model: {e}")
            raise e

    def generate(self, text: str, voice_embedding=None, speed: float = 1.0):
        """
        Runs inference to generate audio from text.
        """
        if not self._model:
            raise RuntimeError("Model not initialized. Call initialize_model() first.")

        logger.info(f"Generating TTS for: '{text[:20]}...' Speed: {speed}")
        
        # --- MOCK INFERENCE ---
        # Real impl: run model.generate()
        time.sleep(0.5) # Simulate inference
        
        # Return dummy audio bytes (1 second of silence or noise)
        # In real world, this returns the audio tensor or bytes
        # simulating a simple sine wave for testability if needed, or just bytes
        # Generate a 1-second sine wave at 440Hz (A4)
        sample_rate = 24000
        duration = 1.0
        t = torch.linspace(0, duration, int(sample_rate * duration))
        waveform = torch.sin(2 * torch.pi * 440 * t).unsqueeze(0) # (1, samples)
        
        # Save to in-memory buffer using soundfile
        import io
        import soundfile as sf
        
        # Convert to numpy: (1, samples) -> (samples,)
        audio_np = waveform.squeeze().cpu().numpy()
        
        buffer = io.BytesIO()
        sf.write(buffer, audio_np, sample_rate, format='WAV', subtype='PCM_16')
        return buffer.getvalue()

tts_service = TTSService()
