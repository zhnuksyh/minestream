import { useRef, useEffect, useState } from 'react';
import { Mic, Square } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { useMicrophone } from '../hooks/useMicrophone';
import { api } from '../services/api';

const HARVARD_SENTENCES = [
    "The oak tree was planted in the center of the garden.",
    "Large size in garments is sometimes an advantage.",
    "He knew the skill of the young player was high.",
    "The birch canoe slid on the smooth planks."
];

export const AudioRecorder = () => {
    const { isRecording, startRecording, stopRecording, getFrequencyData } = useMicrophone();
    const [recordTime, setRecordTime] = useState(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | null>(null);
    const timerRef = useRef<any>(null);

    // Timer logic
    useEffect(() => {
        if (isRecording) {
            setRecordTime(0);
            timerRef.current = setInterval(() => setRecordTime(t => t + 1), 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isRecording]);

    // Visualizer Loop
    useEffect(() => {
        if (isRecording) {
            const draw = () => {
                const canvas = canvasRef.current;
                if (!canvas) return;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;

                const width = canvas.width;
                const height = canvas.height;
                const dataArray = getFrequencyData();

                if (dataArray) {
                    ctx.fillStyle = 'rgb(15, 23, 42)'; // Clear
                    ctx.fillRect(0, 0, width, height);

                    const barWidth = (width / dataArray.length) * 2.5;
                    let barHeight;
                    let x = 0;

                    for (let i = 0; i < dataArray.length; i++) {
                        barHeight = (dataArray[i] / 255) * height;
                        ctx.fillStyle = `rgb(239, 68, 68)`; // Red
                        ctx.fillRect(x, height - barHeight, barWidth, barHeight);
                        x += barWidth + 1;
                    }
                }
                animationRef.current = requestAnimationFrame(draw);
            };
            draw();
        } else {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        }
    }, [isRecording, getFrequencyData]);

    const handleStop = async () => {
        stopRecording();
        // Mock API call to clone
        // In real app, we'd collect the chunks and send a blob
        await api.cloneVoice(new Blob([]));
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <Card className="relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold flex items-center gap-2 uppercase tracking-tighter italic">
                    <Mic className="text-red-500" size={20} /> Voice Capture
                </h2>
                <div className="flex items-center gap-2 font-mono text-xs font-bold">
                    <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-slate-600'}`} />
                    <span className={isRecording ? 'text-red-400' : 'text-slate-500'}>{formatTime(recordTime)} / 0:10 SEC</span>
                </div>
            </div>

            {/* Prompt Sentence */}
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 mb-6 text-center shadow-inner">
                <p className="text-[10px] text-slate-500 mb-2 uppercase tracking-[0.2em] font-black">Phonetic Training String</p>
                <p className="text-xl font-medium text-slate-100 italic">
                    "{HARVARD_SENTENCES[Math.min(recordTime % 4, 3)]}"
                </p>
            </div>

            {/* Visualizer Canvas */}
            <canvas
                ref={canvasRef}
                className="w-full h-[100px] bg-slate-950/50 rounded-lg border border-slate-800 mb-6 shadow-inner"
                width={600}
                height={100}
            />

            <div className="flex gap-4">
                {!isRecording ? (
                    <Button
                        onClick={startRecording}
                        variant="danger"
                        className="flex-1 py-4 uppercase tracking-widest"
                    >
                        <Mic size={20} fill="currentColor" className="mr-2" /> Record Sample
                    </Button>
                ) : (
                    <Button
                        onClick={handleStop}
                        variant="secondary"
                        className="flex-1 py-4 uppercase tracking-widest"
                    >
                        <Square size={20} fill="currentColor" className="mr-2" /> End Stream
                    </Button>
                )}
            </div>
        </Card>
    );
};
