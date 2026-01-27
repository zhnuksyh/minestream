import { create } from 'zustand';
import type { AppMode, GeneratedAudio, VoiceMode, VoiceProfile } from '../types';

interface AppState {
    mode: AppMode;
    script: string;
    voiceMode: VoiceMode;
    clonedVoices: VoiceProfile[];
    generatedAudio: GeneratedAudio | null;
    isProcessing: boolean;

    // Actions
    setMode: (mode: AppMode) => void;
    setScript: (script: string) => void;
    setVoiceMode: (mode: VoiceMode) => void;
    setGeneratedAudio: (audio: GeneratedAudio | null) => void;
    setIsProcessing: (isProcessing: boolean) => void;
    addVoice: (voice: VoiceProfile) => void;
    removeVoice: (id: string) => void;
}

export const useStore = create<AppState>((set) => ({
    mode: 'GENERATE',
    script: '',
    voiceMode: 'prompt',
    clonedVoices: [
        { id: '1', name: "Zahin_Main", tag: "Natural" },
        { id: '2', name: "Zahin_Excited", tag: "Gaming" }
    ],
    generatedAudio: null,
    isProcessing: false,

    setMode: (mode) => set({ mode }),
    setScript: (script) => set({ script }),
    setVoiceMode: (voiceMode) => set({ voiceMode }),
    setGeneratedAudio: (generatedAudio) => set({ generatedAudio }),
    setIsProcessing: (isProcessing) => set({ isProcessing }),
    addVoice: (voice) => set((state) => ({ clonedVoices: [...state.clonedVoices, voice] })),
    removeVoice: (id) => set((state) => ({ clonedVoices: state.clonedVoices.filter((v) => v.id !== id) })),
}));
