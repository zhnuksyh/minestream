export interface VoiceProfile {
    id: string;
    name: string;
    tag: 'Natural' | 'Gaming' | 'Narrator' | 'Fantasy' | 'Sci-Fi';
    previewUrl?: string; // Optional URL for previewing the voice
}

export type AppMode = 'GENERATE' | 'CLONE';

export type VoiceMode = 'prompt' | 'library' | 'upload';

export interface GeneratedAudio {
    id: string;
    url: string;
    script: string;
    timestamp: number;
    duration: number;
}
