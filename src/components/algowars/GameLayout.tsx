'use client';

import React, { ReactNode, useState, useRef, useEffect } from 'react';

interface GameLayoutProps {
    editorSlot: ReactNode;
    gameSlot: ReactNode;
    consoleSlot: ReactNode;
}

const GameLayout: React.FC<GameLayoutProps> = ({ editorSlot, gameSlot, consoleSlot }) => {
    // Simple state for resizing (percentage)
    const [editorWidth, setEditorWidth] = useState(50);
    const isDragging = useRef(false);

    const startResize = () => {
        isDragging.current = true;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging.current) return;
            const newWidth = (e.clientX / window.innerWidth) * 100;
            if (newWidth > 20 && newWidth < 80) {
                setEditorWidth(newWidth);
            }
        };

        const handleMouseUp = () => {
            isDragging.current = false;
            document.body.style.cursor = 'default';
            document.body.style.userSelect = 'auto';
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    return (
        <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-200 overflow-hidden">
            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">

                {/* Left Panel: Code Editor */}
                <div style={{ width: `${editorWidth}%` }} className="h-full relative flex-shrink-0">
                    {editorSlot}
                </div>

                {/* Resizer Handle */}
                <div
                    onMouseDown={startResize}
                    className="w-1 bg-slate-800 hover:bg-cyan-600 transition-colors cursor-col-resize flex-shrink-0 z-50"
                />

                {/* Right Panel: Game View & Console */}
                <div style={{ width: `${100 - editorWidth}%` }} className="h-full flex flex-col flex-1 min-w-0">
                    {/* Game View */}
                    <div className="flex-[2] p-4 flex items-center justify-center bg-slate-900/50 overflow-hidden relative border-b border-slate-800">
                        {gameSlot}
                    </div>

                    {/* Console Output (Fixed height for simplicity or flex) */}
                    <div className="flex-1 min-h-[150px] overflow-hidden">
                        {consoleSlot}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default GameLayout;
