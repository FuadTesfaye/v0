'use client';
import { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

const INITIAL_CODE = `// Move to scan the area
api.move('EAST');
api.move('EAST');
api.move('EAST');
api.move('SOUTH');
api.scan();`;

export default function ScriptEditor() {
    const [code, setCode] = useState(INITIAL_CODE);
    const { scriptRunning, setScriptRunning, addLog } = useGameStore();
    const editorRef = useRef(null);

    const handleRunCode = async () => {
        if (scriptRunning) return;

        setScriptRunning(true);
        addLog('Initiating script execution...', 'info');

        try {
            // In a real app, we'd use a sandboxed worker or transformer.
            // For Phase 1, we'll implement the executor in lib/scriptExecutor.ts
            // and call it here. For now, we'll just log and set the state.
            const { executeScript } = await import('@/lib/scriptExecutor');
            await executeScript(code);
        } catch (err: any) {
            addLog(`Runtime Error: ${err.message}`, 'error');
        } finally {
            setScriptRunning(false);
            addLog('Script execution completed.', 'info');
        }
    };

    return (
        <div className="h-full flex flex-col bg-black/40 backdrop-blur-md border border-cyan-500/30 rounded-xl overflow-hidden group">
            <div className="flex justify-between items-center p-3 border-b border-cyan-500/20 bg-cyan-500/5">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">Script Editor</span>
                </div>
                <div className="flex gap-2">
                    <div className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-[10px] text-cyan-400 font-mono">
                        JS v1.0
                    </div>
                </div>
            </div>

            <div className="flex-1 relative min-h-[400px]">
                <Editor
                    height="100%"
                    defaultLanguage="javascript"
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
                        backgroundColor: '#00000000',
                        fontFamily: '"JetBrains Mono", monospace',
                        padding: { top: 16 }
                    }}
                />
            </div>

            <div className="p-4 border-t border-cyan-500/20 bg-black/20">
                <motion.button
                    onClick={handleRunCode}
                    disabled={scriptRunning}
                    className={`w-full py-3 rounded-lg font-bold tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden ${scriptRunning
                            ? 'bg-cyan-500/10 text-cyan-500/50 cursor-not-allowed'
                            : 'bg-gradient-to-r from-cyan-600 to-cyan-400 text-black hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] active:scale-[0.98]'
                        }`}
                    whileHover={{ scale: scriptRunning ? 1 : 1.02 }}
                    whileTap={{ scale: scriptRunning ? 1 : 0.98 }}
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
