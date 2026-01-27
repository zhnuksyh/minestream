import { useRef } from 'react';
import { Play, Pause, Download } from 'lucide-react';
import { Card } from './ui/Card';
import { useWaveSurfer } from '../hooks/useWaveSurfer';
import { Button } from './ui/Button';

interface WaveformDisplayProps {
    audioUrl: string;
    title?: string;
}

export const WaveformDisplay = ({ audioUrl, title = "Output Stream" }: WaveformDisplayProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { isPlaying, playPause } = useWaveSurfer({
        containerRef,
        url: audioUrl,
        options: {
            height: 60,
            waveColor: '#4f46e5',
            progressColor: '#818cf8',
        }
    });

    return (
        <Card className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-indigo-400 animate-pulse' : 'bg-slate-600'}`} />
                    {title}
                </span>
                <div className="flex gap-2">
                    <Button
                        size="icon"
                        variant="primary"
                        onClick={playPause}
                        className="rounded-full shadow-lg h-8 w-8"
                    >
                        {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                    </Button>
                    <a href={audioUrl} download="minestream_narration.wav" className="block">
                        <div className="h-8 w-8 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-slate-300 hover:text-white transition-colors">
                            <Download size={14} />
                        </div>
                    </a>
                </div>
            </div>

            <div ref={containerRef} className="w-full" />
        </Card>
    );
};
