import type { GeneratedAudio } from '../types';

const MOCK_AUDIO_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

export const api = {
    generateVoice: async (script: string, _voiceId: string): Promise<GeneratedAudio> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        return {
            id: crypto.randomUUID(),
            url: MOCK_AUDIO_URL,
            script,
            timestamp: Date.now(),
            duration: 15 // Mock duration
        };
    },

    cloneVoice: async (_audioBlob: Blob): Promise<{ success: boolean; id: string }> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 3000));

        return {
            success: true,
            id: crypto.randomUUID()
        };
    }
};
