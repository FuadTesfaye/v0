import { useEffect } from 'react';
import GridCanvas from './GridCanvas';
import ScriptEditor from './ScriptEditor';
import DialoguePanel from './DialoguePanel';
import ConsolePanel from './ConsolePanel';
import { useGameStore } from '@/store/gameStore';

export default function Dashboard() {
    // Timer logic removed as it's not implemented in store


    return (
        <div className="w-full h-screen flex flex-col gap-4 p-4 lg:p-6 overflow-hidden">
            {/* Top Header Section */}
            <div className="flex justify-between items-end border-b border-cyan-500/20 pb-4">
                <div>
                    <h2 className="text-xs font-mono text-cyan-500/60 uppercase tracking-[0.4em] mb-1">Sector 7 // Operation</h2>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                        ALGOWARS
                    </h1>
                </div>
                <div className="flex gap-8 text-[10px] font-mono text-cyan-500/40 uppercase tracking-widest">
                    <div className="flex flex-col items-end">
                        <span className="text-cyan-500/80">Signal Strength</span>
                        <span className="text-green-400">Stable // 128ms</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-cyan-500/80">Objective</span>
                        <span className="text-purple-400">Data Node Breach</span>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 grid grid-cols-12 gap-6 overflow-hidden">
                {/* Left Side: Script Editor */}
                <div className="col-span-12 lg:col-span-4 h-full">
                    <ScriptEditor />
                </div>

                {/* Right Side: Game Canvas and Info */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 h-full min-h-0">
                    <div className="flex-1 min-h-0 relative group">
                        {/* Grid Canvas */}
                        <div className="w-full h-full">
                            <GridCanvas />
                        </div>

                        {/* Overlay Details */}
                        <div className="absolute top-4 left-4 pointer-events-none flex gap-4">
                            <div className="px-3 py-1 bg-black/60 border border-cyan-500/30 rounded-md text-[10px] font-mono text-cyan-400">
                                LVL 01: DIVE_INTO_NEON
                            </div>
                        </div>
                    </div>

                    {/* Bottom Narrative and Console */}
                    <div className="grid grid-cols-12 gap-6 h-48 flex-shrink-0">
                        <div className="col-span-12 md:col-span-7">
                            <DialoguePanel />
                        </div>
                        <div className="col-span-12 md:col-span-5">
                            <ConsolePanel />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
