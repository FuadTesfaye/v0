
'use client';

import React from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { Play, RotateCcw } from 'lucide-react';

interface CodeEditorProps {
    code: string;
    language: 'javascript' | 'python';
    onChange: (value: string | undefined) => void;
    onRun: () => void;
    onLanguageChange: (lang: 'javascript' | 'python') => void;
    readOnly?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
    code,
    language,
    onChange,
    onRun,
    onLanguageChange,
    readOnly = false
}) => {
    const handleEditorDidMount: OnMount = (editor, monaco) => {
        // Define a custom theme
        monaco.editor.defineTheme('algowars-theme', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: 'comment', foreground: '6272a4' },
                { token: 'keyword', foreground: 'ff79c6' },
                { token: 'string', foreground: 'f1fa8c' },
            ],
            colors: {
                'editor.background': '#0f172a', // slate-900
                'editor.lineHighlightBackground': '#1e293b',
            }
        });
        monaco.editor.setTheme('algowars-theme');
    };

    return (
        <div className="flex flex-col h-full bg-slate-900 border-r border-slate-700">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-cyan-400">COMBAT_OS v1.0</span>
                    <select
                        value={language}
                        onChange={(e) => onLanguageChange(e.target.value as 'javascript' | 'python')}
                        className="bg-slate-900 text-xs text-slate-300 border border-slate-600 rounded px-2 py-1 focus:outline-none focus:border-cyan-500"
                    >
                        <option value="javascript">JavaScript (Node)</option>
                        <option value="python">Python 3</option>
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onRun}
                        className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-slate-900 bg-cyan-400 rounded hover:bg-cyan-300 transition-colors"
                    >
                        <Play size={14} />
                        EXECUTE
                    </button>
                </div>
            </div>

            {/* Editor */}
            <div className="flex-1 overflow-hidden relative">
                <div className="absolute inset-0">
                    <Editor
                        height="100%"
                        defaultLanguage="javascript"
                        language={language}
                        value={code}
                        onChange={onChange}
                        theme="algowars-theme"
                        onMount={handleEditorDidMount}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            lineNumbers: 'on',
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            readOnly,
                            padding: { top: 16 }
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default CodeEditor;
