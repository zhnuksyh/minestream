import { useState, useRef } from 'react';
import { Save, Trash2, Download, Upload, Loader2, Lock } from 'lucide-react';
import { Card } from './ui/Card';
import { useStore } from '../store/useStore';
import { api } from '../services/api';

interface UploadPanelProps {
    onUploadComplete: () => void;
}

const UploadPanel = ({ onUploadComplete }: UploadPanelProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [name, setName] = useState('');
    const [tag, setTag] = useState('Cloned');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { fetchVoices, showToast } = useStore();

    const handleUpload = async () => {
        if (!file || !name) return;

        setIsUploading(true);
        try {
            await api.cloneVoice(file, name, tag);
            await fetchVoices(); // Refresh voice list
            setFile(null);
            setName('');
            onUploadComplete();
            showToast('Voice successfully cloned and added to vault!', 'success');
        } catch (error) {
            console.error('Upload failed:', error);
            showToast('Failed to upload voice. Please try again.', 'error');
        }
        setIsUploading(false);
    };

    return (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* File Drop Zone */}
            <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center transition-colors cursor-pointer h-24 ${file ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 hover:border-indigo-500'}`}
            >
                <Upload size={20} className={file ? 'text-indigo-400 mb-1' : 'text-slate-600 mb-1'} />
                <span className="text-[10px] font-bold text-slate-400 uppercase text-center">
                    {file ? file.name : 'Click to select audio file'}
                </span>
            </div>
            <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
            />

            {/* Name & Tag Inputs */}
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Voice Name"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="Tag (e.g., Narrator)"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />

            {/* Upload Button */}
            <button
                onClick={handleUpload}
                disabled={!file || !name || isUploading}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg text-sm font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
            >
                {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                {isUploading ? 'Uploading...' : 'Clone Voice'}
            </button>
        </div>
    );
};
export const VoiceVault = () => {
    const { clonedVoices, removeVoice, voiceMode, setVoiceMode, selectedVoiceId, setSelectedVoiceId, customVoicePrompt, setCustomVoicePrompt, generatedAudio, fetchVoices, showToast } = useStore();
    const [isSaving, setIsSaving] = useState(false);

    return (
        <Card>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Save className="text-indigo-400" size={20} /> Vault
            </h2>

            {/* Voice Source Selection */}
            <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700 mb-4">
                {(['library', 'prompt', 'upload'] as const).map(v => (
                    <button
                        key={v}
                        onClick={() => setVoiceMode(v)}
                        className={`flex-1 py-1.5 text-[10px] font-black uppercase rounded-md transition-all ${voiceMode === v ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        {v}
                    </button>
                ))}
            </div>

            {/* Mode Content */}
            {voiceMode === 'library' && (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {clonedVoices.map((voice) => (
                        <div
                            key={voice.id}
                            onClick={() => setSelectedVoiceId(voice.id)}
                            className={`group border p-3 rounded-xl flex justify-between items-center transition-all cursor-pointer ${selectedVoiceId === voice.id ? 'bg-indigo-600/20 border-indigo-500 ring-2 ring-indigo-500/20' : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800'}`}
                        >
                            <div className="flex items-center gap-3">
                                {/* Deterministic Avatar */}
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shadow-inner"
                                    style={{
                                        backgroundColor: `hsl(${voice.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360}, 70%, 30%)`,
                                        color: 'white'
                                    }}
                                >
                                    {voice.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                                        {voice.name}
                                        {voice.type === 'locked' && <Lock size={12} className="text-amber-400" />}
                                    </p>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{voice.tag}</p>
                                </div>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={(e) => { e.stopPropagation(); removeVoice(voice.id); }} className="p-1.5 hover:bg-red-500/10 hover:text-red-400 text-slate-500 rounded-lg transition-colors"><Trash2 size={16} /></button>
                                <button className="p-1.5 hover:bg-indigo-500/10 hover:text-indigo-400 text-slate-500 rounded-lg transition-colors"><Download size={16} /></button>
                            </div>
                        </div>
                    ))}
                    {clonedVoices.length === 0 && (
                        <div className="text-center py-6 text-slate-600 text-xs italic">
                            No cloned voices found in vault.
                        </div>
                    )}
                </div>
            )}

            {voiceMode === 'prompt' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-3">
                    <label className="text-[10px] uppercase font-bold text-slate-500 mb-2 block">Voice Description</label>
                    <textarea
                        value={customVoicePrompt}
                        onChange={(e) => setCustomVoicePrompt(e.target.value)}
                        placeholder="Describe the voice: 'A rusty, old pirate captain with a deep growl...'"
                        className="w-full h-32 bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-mono resize-none"
                    />
                    {/* Save Voice Button - appears after generation in prompt mode */}
                    {generatedAudio && customVoicePrompt && (
                        <button
                            onClick={async () => {
                                setIsSaving(true);
                                try {
                                    // Fetch the audio blob from the generated URL
                                    const response = await fetch(generatedAudio.url);
                                    const blob = await response.blob();

                                    // Lock the voice
                                    const voiceName = prompt('Name this voice:') || 'Locked Voice';
                                    await api.lockVoice(blob, voiceName, customVoicePrompt);
                                    await fetchVoices();
                                    showToast('Voice locked and added to library!', 'success');
                                    setVoiceMode('library');
                                } catch (error) {
                                    console.error(error);
                                    showToast('Failed to lock voice.', 'error');
                                }
                                setIsSaving(false);
                            }}
                            disabled={isSaving}
                            className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold uppercase flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
                            {isSaving ? 'Saving...' : 'Lock This Voice'}
                        </button>
                    )}
                </div>
            )}



            {voiceMode === 'upload' && (
                <UploadPanel onUploadComplete={() => {
                    setVoiceMode('library');
                }} />
            )}
        </Card>
    );
};
