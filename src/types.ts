export interface VoiceProfile {
    id: string;
    name: string;
    tag: string;
    type?: 'cloned' | 'locked' | 'preset';
    prompt?: string;
    previewUrl?: string;
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
