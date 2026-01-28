import { useRef, useEffect, useState } from 'react';
import { Mic, Square, Upload, Check, Loader2 } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { useMicrophone } from '../hooks/useMicrophone';
import { api } from '../services/api';
import { useStore } from '../store/useStore';

const HARVARD_SENTENCES = [
    "The oak tree was planted in the center of the garden.",
    "Large size in garments is sometimes an advantage.",
    "He knew the skill of the young player was high.",
    "The birch canoe slid on the smooth planks."
];

export const AudioRecorder = () => {
    const { isRecording, startRecording, stopRecording, getFrequencyData } = useMicrophone();
    const { fetchVoices } = useStore();
    const [recordTime, setRecordTime] = useState(0);
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
    const [voiceName, setVoiceName] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | null>(null);
    const timerRef = useRef<any>(null);

    // Timer logic
    useEffect(() => {
        if (isRecording) {
            setRecordTime(0);
            setRecordedBlob(null);
            setUploadSuccess(false);
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
                    ctx.fillStyle = 'rgb(15, 23, 42)';
                    ctx.fillRect(0, 0, width, height);

                    const barWidth = (width / dataArray.length) * 2.5;
                    let barHeight;
                    let x = 0;

                    for (let i = 0; i < dataArray.length; i++) {
                        barHeight = (dataArray[i] / 255) * height;
                        ctx.fillStyle = `rgb(239, 68, 68)`;
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
        const blob = await stopRecording();
        if (blob) {
            setRecordedBlob(blob);
        }
    };

    const handleUpload = async () => {
        if (!recordedBlob || !voiceName.trim()) return;

        setIsUploading(true);
        try {
            await api.cloneVoice(recordedBlob, voiceName.trim(), 'Cloned');
            await fetchVoices();
            setUploadSuccess(true);
            setRecordedBlob(null);
            setVoiceName('');
        } catch (error) {
            console.error('Clone failed:', error);
        }
        setIsUploading(false);
    };

    const handleReset = () => {
        setRecordedBlob(null);
        setVoiceName('');
        setUploadSuccess(false);
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

            {/* Action Buttons */}
            {!recordedBlob && !uploadSuccess && (
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
            )}

            {/* Post-Recording: Name Input & Upload */}
            {recordedBlob && !uploadSuccess && (
                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex gap-3 items-center p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
                        <Check size={18} className="text-indigo-400" />
                        <span className="text-sm text-indigo-300">Recording captured! ({(recordedBlob.size / 1024).toFixed(1)} KB)</span>
                    </div>
                    <input
                        type="text"
                        value={voiceName}
                        onChange={(e) => setVoiceName(e.target.value)}
                        placeholder="Name this voice (e.g., 'My Voice')"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="flex gap-3">
                        <Button
                            onClick={handleReset}
                            variant="ghost"
                            className="flex-1 py-3"
                        >
                            Re-record
                        </Button>
                        <Button
                            onClick={handleUpload}
                            disabled={!voiceName.trim() || isUploading}
                            className="flex-1 py-3"
                        >
                            {isUploading ? <Loader2 size={18} className="mr-2 animate-spin" /> : <Upload size={18} className="mr-2" />}
                            {isUploading ? 'Cloning...' : 'Clone Voice'}
                        </Button>
                    </div>
                </div>
            )}

            {/* Success State */}
            {uploadSuccess && (
                <div className="text-center py-6 animate-in fade-in duration-300">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                        <Check size={32} className="text-green-400" />
                    </div>
                    <p className="text-lg font-bold text-green-400 mb-2">Voice Cloned!</p>
                    <p className="text-sm text-slate-500 mb-4">Your voice is now available in the Library.</p>
                    <Button onClick={handleReset} variant="ghost">Record Another</Button>
                </div>
            )}
        </Card>
    );
};
