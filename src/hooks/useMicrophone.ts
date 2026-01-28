import { useState, useRef, useEffect, useCallback } from 'react';

interface UseMicrophoneReturn {
    isRecording: boolean;
    startRecording: () => Promise<void>;
    stopRecording: () => Promise<Blob | null>;
    getFrequencyData: () => Uint8Array | null;
}

export const useMicrophone = (): UseMicrophoneReturn => {
    const [isRecording, setIsRecording] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const resolveStopRef = useRef<((blob: Blob | null) => void) | null>(null);

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            // Setup AudioContext for visualization
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            analyser.fftSize = 256;

            audioContextRef.current = audioContext;
            analyserRef.current = analyser;

            // Setup MediaRecorder for capturing audio
            chunksRef.current = [];
            const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                if (resolveStopRef.current) {
                    resolveStopRef.current(blob);
                    resolveStopRef.current = null;
                }
            };

            mediaRecorderRef.current = mediaRecorder;
            mediaRecorder.start(100); // Collect in 100ms chunks

            setIsRecording(true);
        } catch (error) {
            console.error("Error accessing microphone:", error);
        }
    }, []);

    const stopRecording = useCallback((): Promise<Blob | null> => {
        return new Promise((resolve) => {
            resolveStopRef.current = resolve;

            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                mediaRecorderRef.current.stop();
            } else {
                resolve(null);
            }

            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
            if (audioContextRef.current) {
                audioContextRef.current.close();
                audioContextRef.current = null;
            }
            analyserRef.current = null;
            mediaRecorderRef.current = null;
            setIsRecording(false);
        });
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
            if (mediaRecorderRef.current) {
                mediaRecorderRef.current.stop();
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    return { isRecording, startRecording, stopRecording, getFrequencyData };
};
