import { create } from 'zustand';
import type { AppMode, GeneratedAudio, VoiceMode, VoiceProfile } from '../types';

interface AppState {
    mode: AppMode;
    script: string;
    voiceMode: VoiceMode;
    clonedVoices: VoiceProfile[];
    selectedVoiceId: string | null;
    generatedAudio: GeneratedAudio | null;
    isProcessing: boolean;

    // Actions
    setMode: (mode: AppMode) => void;
    setScript: (script: string) => void;
    setVoiceMode: (mode: VoiceMode) => void;
    setSelectedVoiceId: (id: string) => void;
    setGeneratedAudio: (audio: GeneratedAudio | null) => void;
    setIsProcessing: (isProcessing: boolean) => void;
    addVoice: (voice: VoiceProfile) => void;
    removeVoice: (id: string) => void;
    fetchVoices: () => Promise<void>;

    // Dynamic Voice
    customVoicePrompt: string;
    setCustomVoicePrompt: (prompt: string) => void;

    // Toast Notification
    toast: { message: string; type: 'success' | 'error' | 'info' } | null;
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
    hideToast: () => void;
}

import { api } from '../services/api';

export const useStore = create<AppState>((set) => ({
    mode: 'GENERATE',
    script: '',
    voiceMode: 'library',
    clonedVoices: [], // Empty initially
    selectedVoiceId: null, // Track selected voice
    generatedAudio: null,
    isProcessing: false,

    setMode: (mode) => set({ mode }),
    setScript: (script) => set({ script }),
    setVoiceMode: (voiceMode) => set({ voiceMode }),
    setSelectedVoiceId: (id) => set({ selectedVoiceId: id }),
    setGeneratedAudio: (generatedAudio) => set({ generatedAudio }),
    setIsProcessing: (isProcessing) => set({ isProcessing }),
    addVoice: (voice) => set((state) => ({ clonedVoices: [...state.clonedVoices, voice] })),
    removeVoice: (id) => set((state) => ({ clonedVoices: state.clonedVoices.filter((v) => v.id !== id) })),

    // Dynamic
    customVoicePrompt: '',
    setCustomVoicePrompt: (prompt) => set({ customVoicePrompt: prompt }),

    // Toast
    toast: null,
    showToast: (message, type = 'info') => set({ toast: { message, type } }),
    hideToast: () => set({ toast: null }),

    fetchVoices: async () => {
        const voices = await api.getVoices();
        set({ clonedVoices: voices });
        // Select first voice by default if available
        if (voices.length > 0) set({ selectedVoiceId: voices[0].id });
    }
}));
