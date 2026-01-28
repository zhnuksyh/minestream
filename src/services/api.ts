import type { GeneratedAudio } from '../types';

const API_BASE_URL = "http://localhost:8000/api/v1";

export const api = {
    generateVoice: async (text: string, voiceId?: string): Promise<GeneratedAudio> => {
        try {
            const response = await fetch(`${API_BASE_URL}/tts/generate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text,
                    voice_id: voiceId,
                    speed: 1.0,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate audio");
            }

            const data = await response.json();

            // Adapt backend response to GeneratedAudio interface
            return {
                id: crypto.randomUUID(), // Backend doesn't return ID for the generation event itself yet, so we gen one for UI
                url: `http://localhost:8000${data.audio_url}`, // Backend returns relative path
                script: data.text_processed,
                timestamp: Date.now(),
                duration: 0 // We'll let WaveSurfer calculate the actual duration
            };
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    },

    cloneVoice: async (audioBlob: Blob, name: string, tag: string): Promise<{ success: boolean; id: string }> => {
        try {
            const formData = new FormData();
            formData.append("audio", audioBlob);
            formData.append("name", name);
            formData.append("tag", tag);

            const response = await fetch(`${API_BASE_URL}/clone/extract`, {
                method: "POST",
                body: formData, // fetch automatically sets Content-Type to multipart/form-data
            });

            if (!response.ok) {
                throw new Error("Failed to upload voice sample");
            }

            const data = await response.json();
            return {
                success: true,
                id: data.voice.id
            };
        } catch (error) {
            console.error("Clone API Error:", error);
            throw error;
        }
    },

    getVoices: async (): Promise<any[]> => {
        try {
            const response = await fetch(`${API_BASE_URL}/clone/list`);
            if (!response.ok) throw new Error("Failed to fetch voices");
            const data = await response.json();
            return data.voices;
        } catch (error) {
            console.error("Fetch Voices Error:", error);
            return [];
        }
    }
};
