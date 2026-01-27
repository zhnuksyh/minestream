import os
import torchaudio
import torch

class AudioService:
    @staticmethod
    def save_upload(file_data: bytes, dest_path: str):
        with open(dest_path, "wb") as buffer:
            buffer.write(file_data)
        return dest_path

    @staticmethod
    def load_audio(file_path: str, target_sr: int = 24000):
        """
        Loads audio and resamples it to the target sample rate used by the model.
        Returns a tensor.
        """
        waveform, sample_rate = torchaudio.load(file_path)
        if sample_rate != target_sr:
            resampler = torchaudio.transforms.Resample(orig_freq=sample_rate, new_freq=target_sr)
            waveform = resampler(waveform)
        
        # Ensure mono
        if waveform.shape[0] > 1:
             waveform = torch.mean(waveform, dim=0, keepdim=True)
             
        return waveform
