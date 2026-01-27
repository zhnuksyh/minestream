import { useState, useRef, useEffect, useCallback } from 'react';

interface UseMicrophoneReturn {
    isRecording: boolean;
    startRecording: () => Promise<void>;
    stopRecording: () => void;
    getFrequencyData: () => Uint8Array | null;
}

export const useMicrophone = (): UseMicrophoneReturn => {
    const [isRecording, setIsRecording] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaStreamSource(stream);

            source.connect(analyser);
            analyser.fftSize = 256;

            audioContextRef.current = audioContext;
            analyserRef.current = analyser;
            setIsRecording(true);
        } catch (error) {
            console.error("Error accessing microphone:", error);
        }
    }, []);

    const stopRecording = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
        analyserRef.current = null;
        setIsRecording(false);
    }, []);

    const getFrequencyData = useCallback(() => {
        if (!analyserRef.current) return null;

        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);
        return dataArray;
    }, []);

    useEffect(() => {
        return () => {
            stopRecording();
        };
    }, [stopRecording]);

    return { isRecording, startRecording, stopRecording, getFrequencyData };
};
