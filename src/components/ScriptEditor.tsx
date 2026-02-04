import { Card } from './ui/Card';

interface ScriptEditorProps {
    script: string;
    setScript: (script: string) => void;
}

export const ScriptEditor = ({ script, setScript }: ScriptEditorProps) => {
    return (
        <Card className="relative group">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    Script Editor
                </h2>
            </div>

            <div className="space-y-4">
                <textarea
                    value={script}
                    onChange={(e) => setScript(e.target.value)}
                    placeholder="Write your text commentary here..."
                    className="w-full h-48 bg-slate-800 border border-slate-700 rounded-xl p-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none transition-all text-sm leading-relaxed"
                />

                <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    <span>{/* Spacer */}</span>
                    <div className="flex gap-4">
                        <span>Wrd: {script.trim() ? script.trim().split(/\s+/).length : 0}</span>
                        <span>Chr: {script.length}</span>
                    </div>
                </div>
            </div>
        </Card>
    );
};
