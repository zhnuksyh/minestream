import { Zap, CheckCircle, Music, Mic, Play, Download, AlertCircle } from 'lucide-react';
import { useStore } from './store/useStore';
import { api } from './services/api';
import { ScriptEditor } from './components/ScriptEditor';
import { VoiceVault } from './components/VoiceVault';
import { AudioRecorder } from './components/AudioRecorder';
import { WaveformDisplay } from './components/WaveformDisplay';
import { Button } from './components/ui/Button';
import { Card } from './components/ui/Card';

function App() {
  const { mode, setMode, script, setScript, generatedAudio, setGeneratedAudio, isProcessing, setIsProcessing } = useStore();

  const handleGenerate = async () => {
    setIsProcessing(true);
    try {
      const result = await api.generateVoice(script, "default-voice");
      setGeneratedAudio(result);
    } catch (error) {
      console.error(error);
    }
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
              <Zap className="text-white" size={20} fill="currentColor" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter uppercase italic">
              Mine<span className="text-indigo-400">Stream</span>
            </h1>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
            <span className="hidden sm:inline">User: Zahin</span>
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 shadow-lg">
              Z
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Mode Toggle */}
        <div className="flex bg-slate-800 p-1 rounded-xl mb-8 w-fit mx-auto border border-slate-700 shadow-lg">
          <button
            onClick={() => setMode('GENERATE')}
            className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-all ${mode === 'GENERATE' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            <Music size={18} /> Generate Voice
          </button>
          <button
            onClick={() => setMode('CLONE')}
            className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-all ${mode === 'CLONE' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            <Mic size={18} /> Voice Cloning
          </button>
        </div>

        {/* GENERATE MODE */}
        {mode === 'GENERATE' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ScriptEditor script={script} setScript={setScript} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <VoiceVault />

              {/* Action Buttons */}
              <Card className="flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-semibold mb-2">Process</h2>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">Run the script through the local Qwen3 model. Use preview to verify prosody before downloading.</p>
                </div>
                <div className="space-y-3">
                  <Button
                    onClick={handleGenerate}
                    isLoading={isProcessing}
                    className="w-full"
                    variant="secondary"
                  >
                    <Play size={18} fill="currentColor" className="mr-2" /> Preview Audio
                  </Button>
                  <Button
                    className="w-full shadow-lg shadow-indigo-500/30"
                  >
                    <Download size={18} className="mr-2" /> Export Full .WAV
                  </Button>
                  {generatedAudio && (
                    <Button
                      variant="ghost"
                      className="w-full text-xs uppercase tracking-widest"
                      onClick={() => navigator.clipboard.writeText(generatedAudio.url)}
                    >
                      Copy Path
                    </Button>
                  )}
                </div>
              </Card>
            </div>

            {generatedAudio && (
              <WaveformDisplay audioUrl={generatedAudio.url} />
            )}
          </div>
        )}

        {/* CLONE MODE */}
        {mode === 'CLONE' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Expanded column for recorder */}
              <div className="md:col-span-2">
                <AudioRecorder />
              </div>

              {/* Vault as Library */}
              <div className="md:col-span-2">
                <VoiceVault />
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl">
              <AlertCircle className="text-indigo-500 shrink-0" size={20} />
              <div className="text-sm">
                <p className="font-black text-indigo-400 uppercase text-[10px] tracking-widest mb-1">Optimization Protocol</p>
                <p className="text-indigo-300/60 leading-tight">Zero-shot inference requires high signal-to-noise ratio. Ensure your mic is clear of keyboard clicks for the best clone.</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-12 border-t border-slate-800 py-8">
        <div className="max-w-4xl mx-auto px-6 text-center text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em]">
          <p>© 2026 MineStream • Neural Synthesis Terminal</p>
          <div className="mt-4 flex justify-center gap-6">
            <span className="flex items-center gap-1.5"><CheckCircle size={12} className="text-indigo-500" /> Kernel Active</span>
            <span className="flex items-center gap-1.5"><Zap size={12} className="text-indigo-500" /> GPU High-Freq</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
