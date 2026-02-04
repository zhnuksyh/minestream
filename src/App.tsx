import { useEffect } from 'react';
import { Music, Mic, Play, Download, AlertCircle } from 'lucide-react';
import { useStore } from './store/useStore';
import { api } from './services/api';
import { ScriptEditor } from './components/ScriptEditor';
import { VoiceVault } from './components/VoiceVault';
import { AudioRecorder } from './components/AudioRecorder';
import { WaveformDisplay } from './components/WaveformDisplay';
import { Button } from './components/ui/Button';
import { Card } from './components/ui/Card';
import { Toast } from './components/ui/Toast';
import { Loading } from './components/ui/Loading';

function App() {
  const { mode, setMode, script, setScript, generatedAudio, setGeneratedAudio, isProcessing, setIsProcessing, fetchVoices, selectedVoiceId, voiceMode, customVoicePrompt, toast, hideToast, clonedVoices } = useStore();

  useEffect(() => {
    fetchVoices();
  }, [fetchVoices]);

  const handleGenerate = async () => {
    // Validation based on mode
    if (!script) return;
    if (voiceMode === 'library' && !selectedVoiceId) return;
    if (voiceMode === 'prompt' && !customVoicePrompt) return;

    setIsProcessing(true);
    try {
      const idToSend = voiceMode === 'library' ? selectedVoiceId || undefined : undefined;
      const promptToSend = voiceMode === 'prompt' ? customVoicePrompt : undefined;
      const result = await api.generateVoice(script, idToSend, promptToSend);
      setGeneratedAudio(result);
    } catch (error) {
      console.error(error);
    }
    setIsProcessing(false);
  };

  const getSelectedVoiceName = () => {
    if (voiceMode === 'library') {
      const voice = clonedVoices.find(v => v.id === selectedVoiceId);
      return voice ? voice.name : 'No Voice Selected';
    }
    if (voiceMode === 'prompt') return 'Custom Prompt';
    if (voiceMode === 'upload') return 'Cloning...';
    return '-';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      <header className="py-8 text-center animate-in fade-in slide-in-from-top-4 duration-700">
        <img src="/logo.png" alt="MineStream" className="h-16 mx-auto hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
      </header>

      <main className="max-w-4xl mx-auto px-6 pb-12">

        {/* Mode Toggle */}
        <div className="flex bg-slate-900/80 backdrop-blur-sm p-1.5 rounded-xl mb-10 w-fit mx-auto border border-slate-700/50 shadow-2xl">
          <button
            onClick={() => setMode('GENERATE')}
            className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-all font-bold tracking-wide ${mode === 'GENERATE' ? 'bg-indigo-600 text-white shadow-lg scale-105' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Music size={18} /> GENERATE
          </button>
          <button
            onClick={() => setMode('CLONE')}
            className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-all font-bold tracking-wide ${mode === 'CLONE' ? 'bg-indigo-600 text-white shadow-lg scale-105' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Mic size={18} /> CLONE
          </button>
        </div>

        {/* GENERATE MODE */}
        {mode === 'GENERATE' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <ScriptEditor script={script} setScript={setScript} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <VoiceVault />

              {/* Action Buttons */}
              <Card className="flex flex-col justify-between border-slate-700/50 bg-slate-900/50 backdrop-blur-sm h-full">
                <div>
                  <h2 className="text-lg font-bold mb-4 uppercase tracking-wider text-slate-400">Process Control</h2>

                  {/* Status Indicator */}
                  <div className="mb-6 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Active Input</p>
                    <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                      {getSelectedVoiceName()}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button
                    onClick={handleGenerate}
                    disabled={isProcessing}
                    className="w-full h-12 text-sm uppercase tracking-widest font-bold bg-indigo-600 hover:bg-indigo-500 transition-all hover:scale-[1.02] shadow-xl shadow-indigo-500/20"
                  >
                    {isProcessing ? <Loading /> : <span className="flex items-center justify-center gap-2"><Play size={18} fill="currentColor" /> Generate Audio</span>}
                  </Button>

                  <Button
                    className="w-full h-12 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all font-bold uppercase tracking-widest text-xs"
                  >
                    <Download size={18} className="mr-2" /> Export WAV
                  </Button>

                  {generatedAudio && (
                    <Button
                      variant="ghost"
                      className="w-full text-[10px] uppercase tracking-widest text-slate-500 hover:text-indigo-400"
                      onClick={() => navigator.clipboard.writeText(generatedAudio.url)}
                    >
                      Copy File Path
                    </Button>
                  )}
                </div>
              </Card>
            </div>

            {generatedAudio && (
              <div className="animate-in fade-in zoom-in duration-500">
                <WaveformDisplay audioUrl={generatedAudio.url} />
              </div>
            )}
          </div>
        )}

        {/* CLONE MODE */}
        {mode === 'CLONE' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

      {/* Global Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
}

export default App;
