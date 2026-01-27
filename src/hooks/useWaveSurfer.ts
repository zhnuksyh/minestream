import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

interface UseWaveSurferProps {
    containerRef: React.RefObject<HTMLElement | null>;
    url?: string;
    options?: Partial<import('wavesurfer.js').WaveSurferOptions>;
}

export const useWaveSurfer = ({ containerRef, url, options }: UseWaveSurferProps) => {
    const wavesurferRef = useRef<WaveSurfer | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        if (!containerRef.current) return;

        const ws = WaveSurfer.create({
            container: containerRef.current,
            waveColor: '#4f46e5', // Indigo-600
            progressColor: '#818cf8', // Indigo-400
            cursorColor: '#c7d2fe',
            barWidth: 2,
            barGap: 3,
            height: 80,
            ...options,
        });

        ws.on('play', () => setIsPlaying(true));
        ws.on('pause', () => setIsPlaying(false));
        ws.on('timeupdate', (currentTime) => setCurrentTime(currentTime));
        ws.on('ready', (duration) => setDuration(duration));

        wavesurferRef.current = ws;

        return () => {
            ws.destroy();
        };
    }, [containerRef, options]);

    useEffect(() => {
        if (wavesurferRef.current && url) {
            wavesurferRef.current.load(url);
        }
    }, [url]);

    const playPause = () => {
        wavesurferRef.current?.playPause();
    };

    return { wavesurfer: wavesurferRef.current, isPlaying, currentTime, duration, playPause };
};
