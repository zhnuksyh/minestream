import { Save, Trash2, Download, Upload } from 'lucide-react';
import { Card } from './ui/Card';
import { useStore } from '../store/useStore';

export const VoiceVault = () => {
    const { clonedVoices, removeVoice, voiceMode, setVoiceMode, selectedVoiceId, setSelectedVoiceId } = useStore();

    return (
        <Card>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Save className="text-indigo-400" size={20} /> Vault
            </h2>

            {/* Voice Source Selection */}
            <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700 mb-4">
                {(['library', 'upload'] as const).map(v => (
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
                            <div>
                                <p className="text-sm font-bold text-slate-200">{voice.name}</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{voice.tag}</p>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => removeVoice(voice.id)} className="p-1.5 hover:text-red-400 text-slate-500 transition-colors"><Trash2 size={14} /></button>
                                <button className="p-1.5 hover:text-indigo-400 text-slate-500 transition-colors"><Download size={14} /></button>
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



            {voiceMode === 'upload' && (
                <div className="border-2 border-dashed border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center hover:border-indigo-500 transition-colors cursor-pointer group h-32">
                    <Upload size={24} className="text-slate-600 group-hover:text-indigo-400 transition-colors mb-2" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase text-center">Reference File Required</span>
                </div>
            )}
        </Card>
    );
};
