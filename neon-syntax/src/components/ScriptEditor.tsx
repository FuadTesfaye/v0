import { useEffect, useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { useScriptSandbox } from '@/hooks/useScriptSandbox';
import { SCAFFOLDS } from '@/lib/scaffolds';

export default function ScriptEditor() {
    const {
        grid,
        activeUnitId,
        updateUnitScript,
        resolveTurn,
        scriptRunning,
        setScriptRunning,
        addLog,
        language
    } = useGameStore();

    const activeUnit = grid.units.find(u => u.id === activeUnitId);
    // Determine language to use: unit's specific language if any (future proofing) or game global language
    const editorLanguage = language || 'javascript';
    const [code, setCode] = useState(activeUnit?.currentScript || SCAFFOLDS[editorLanguage] || '');
    const editorRef = useRef<any>(null);
    const { executeScript } = useScriptSandbox();

    useEffect(() => {
        if (activeUnit) {
            // If unit has script, use it. Else use scaffold for current language.
            setCode(activeUnit.currentScript || SCAFFOLDS[editorLanguage]);
        }
    }, [activeUnitId, activeUnit?.currentScript, editorLanguage]);

    const handleRunCode = async () => {
        if (scriptRunning || !activeUnitId) return;

        setScriptRunning(true);
        addLog(`Executing script for [${activeUnitId}]...`, 'command');

        try {
            // 1. Get actions from sandbox
            // 1. Get actions from sandbox
            const actions = await executeScript(code, editorLanguage);

            // 2. Update the script in store
            updateUnitScript(activeUnitId, code);

            // 3. Resolve turn with these actions
            // In Phase 2, we just resolve for the active unit. 
            // In Phase 5, we'll resolve for all units.
            resolveTurn([{ unitId: activeUnitId, actions }]);

            addLog('Turn resolved successfully.', 'success');
        } catch (err: any) {
            addLog(`Syntax/Runtime Error: ${err.message}`, 'error');
        } finally {
            setScriptRunning(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-black/40 backdrop-blur-md border border-cyan-500/30 rounded-xl overflow-hidden group">
            <div className="flex justify-between items-center p-3 border-b border-cyan-500/20 bg-cyan-500/5">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">
                        {activeUnit ? `Script Editor // ${activeUnit.id}` : 'No Unit Selected'}
                    </span>
                </div>
                <div className="flex gap-2 text-[10px] font-mono text-cyan-500/40">
                    {activeUnit?.type} // {activeUnit?.health}HP
                </div>
            </div>

            <div className="flex-1 relative min-h-[400px]">
                <Editor
                    height="100%"
                    defaultLanguage={editorLanguage}
                    language={editorLanguage}
                    theme="vs-dark"
                    value={code}
                    onChange={(val) => setCode(val || '')}
                    onMount={(editor) => {
                        editorRef.current = editor;
                    }}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        fontFamily: '"JetBrains Mono", monospace',
                        padding: { top: 16 }
                    }}
                />
            </div>

            <div className="p-4 border-t border-cyan-500/20 bg-black/20">
                <motion.button
                    onClick={handleRunCode}
                    disabled={scriptRunning || !activeUnitId}
                    className={`w-full py-3 rounded-lg font-bold tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden ${scriptRunning || !activeUnitId
                        ? 'bg-cyan-500/10 text-cyan-500/50 cursor-not-allowed'
                        : 'bg-gradient-to-r from-cyan-600 to-cyan-400 text-black hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] active:scale-[0.98]'
                        }`}
                    whileHover={{ scale: (scriptRunning || !activeUnitId) ? 1 : 1.02 }}
                    whileTap={{ scale: (scriptRunning || !activeUnitId) ? 1 : 0.98 }}
                >
                    {scriptRunning ? (
                        <>
                            <motion.div
                                className="w-4 h-4 border-2 border-cyan-500/50 border-t-cyan-500 rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            Executing...
                        </>
                    ) : (
                        <>
                            <span>Run Code</span>
                            <span className="text-xs">▶</span>
                        </>
                    )}
                </motion.button>
            </div>
        </div>
    );
}
