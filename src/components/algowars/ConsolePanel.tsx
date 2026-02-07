
'use client';

import React, { useRef, useEffect } from 'react';

interface ConsolePanelProps {
    logs: string[];
}

const ConsolePanel: React.FC<ConsolePanelProps> = ({ logs }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="flex flex-col h-full bg-black border-t border-slate-700 font-mono text-xs">
            <div className="flex items-center px-4 py-1 bg-slate-900 border-b border-slate-800">
                <span className="text-slate-400">SYSTEM_LOGS</span>
            </div>
            <div className="flex-1 overflow-auto p-2 space-y-1 text-green-400 custom-scrollbar" ref={scrollRef}>
                {logs.length === 0 && <span className="text-slate-600 italic">No output...</span>}
                {logs.map((log, i) => (
                    <div key={i} className="break-all border-l-2 border-slate-800 pl-2">
                        <span className="opacity-50 select-none mr-2">
                            {String(i).padStart(3, '0')} &gt;
                        </span>
                        {log}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ConsolePanel;
