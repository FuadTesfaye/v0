'use client';
import { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import GridCanvas from '@/components/GridCanvas';
import ConsolePanel from '@/components/ConsolePanel';
import Link from 'next/link';

export default function PlayPage() {
    const {
        resources, turn, status,
        moveUnit, placeVirusValues, endTurn, startGame,
        activeUnitId, selectionMode
    } = useGameStore();

    // Input Handling
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (activeUnitId && selectionMode === 'NONE') {
                if (e.key === 'ArrowUp') moveUnit(activeUnitId, 'UP');
                if (e.key === 'ArrowDown') moveUnit(activeUnitId, 'DOWN');
                if (e.key === 'ArrowLeft') moveUnit(activeUnitId, 'LEFT');
                if (e.key === 'ArrowRight') moveUnit(activeUnitId, 'RIGHT');
            }

            if (e.code === 'Space') {
                endTurn();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeUnitId, moveUnit, endTurn, selectionMode]);

    // Auto-Start
    useEffect(() => {
        startGame();
    }, [startGame]);

    return (
        <main className="min-h-screen bg-[#020205] text-slate-200 p-6 flex flex-col gap-6 relative overflow-hidden font-mono">

            {/* Header / HUD */}
            <div className="flex justify-between items-center z-10 border-b border-cyan-900/50 pb-4">
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-cyan-500 tracking-widest">ALGO_WARS // TACTICAL</h1>
                    <div className="text-xs text-slate-500">OP: ELIMINATE_RAT_KING</div>
                </div>

                <div className="flex gap-12 text-sm">
                    <div className="text-center">
                        <div className="text-slate-500 text-[10px] uppercase">Turn Cycle</div>
                        <div className="text-xl text-white font-bold">{turn.toString().padStart(3, '0')}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-slate-500 text-[10px] uppercase">Energy Reserves</div>
                        <div className={`text-xl font-bold ${resources.energy > 0 ? 'text-yellow-400' : 'text-red-500'}`}>
                            {resources.energy}
                        </div>
                    </div>
                </div>

                <Link href="/algowars" className="text-xs text-red-500 hover:text-red-400 border border-red-900 px-3 py-1 rounded">
                    ABORT_MISSION
                </Link>
            </div>

            {/* Main Layout */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 z-10">

                {/* Left Panel: Tactics */}
                <div className="space-y-4">
                    <div className="p-4 bg-slate-900/50 border border-slate-800 rounded">
                        <h3 className="text-cyan-500 text-xs mb-4 uppercase tracking-wider border-b border-slate-800 pb-2">Command & Control</h3>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-xs">
                                <span>VIRUS NODES</span>
                                <span className="text-purple-400">{resources.virusNodesAvailable}/3</span>
                            </div>
                            <button
                                onClick={() => useGameStore.setState({ selectionMode: 'PLACE_VIRUS' })}
                                disabled={resources.virusNodesAvailable === 0}
                                className="w-full py-2 bg-purple-900/20 border border-purple-500/50 text-purple-400 text-xs hover:bg-purple-900/40 disabled:opacity-50 transition-all"
                            >
                                DEPLOY VIRUS NODE
                            </button>

                            <div className="h-4"></div>

                            <div className="flex justify-between items-center text-xs">
                                <span>REINFORCEMENTS</span>
                                <span className="text-yellow-400">2 ENERGY</span>
                            </div>
                            <button
                                onClick={() => useGameStore.getState().spawnSoldier()}
                                disabled={resources.energy < 2}
                                className="w-full py-2 bg-yellow-900/20 border border-yellow-500/50 text-yellow-400 text-xs hover:bg-yellow-900/40 disabled:opacity-50 transition-all"
                            >
                                SPAWN SOLDIER
                            </button>
                        </div>
                    </div>

                    <div className="p-4 bg-slate-900/50 border border-slate-800 rounded">
                        <h3 className="text-slate-500 text-xs mb-2 uppercase">Protocol Guide</h3>
                        <ul className="space-y-2 text-[10px] text-slate-400 list-disc pl-4">
                            <li>Master Bot gains +2 Energy on <span className="text-yellow-400">Amber Nodes</span>.</li>
                            <li>Unused Energy <span className="text-red-400">decays</span> each turn.</li>
                            <li>Trap the Rat King using <span className="text-purple-400">Virus Nodes</span>.</li>
                            <li>Press <span className="text-white border border-slate-700 px-1">SPACE</span> to End Turn.</li>
                        </ul>
                    </div>
                </div>

                {/* Center: Grid */}
                <div className="lg:col-span-2 h-[600px] relative">
                    <GridCanvas />
                </div>

                {/* Right: Console */}
                <div className="flex flex-col gap-4 h-[600px]">
                    <div className="flex-1 bg-black border border-slate-800 rounded overflow-hidden">
                        <ConsolePanel />
                    </div>
                </div>
            </div>

            {/* Victory / Defeat Overlay */}
            {status !== 'PLAYING' && (
                <div className="absolute inset-0 bg-black/90 z-50 flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <h1 className={`text-6xl font-bold ${status === 'VICTORY' ? 'text-green-500' : 'text-red-500'}`}>
                            {status === 'VICTORY' ? 'MISSION ACCOMPLISHED' : 'SYSTEM FAILURE'}
                        </h1>
                        <p className="text-slate-400">
                            {status === 'VICTORY' ? 'Rat King neutralized. Domain secured.' : 'Operational capacity critical. Retrying...'}
                        </p>
                        <button
                            onClick={() => startGame()}
                            className="px-8 py-3 bg-cyan-600 text-black font-bold hover:bg-cyan-500"
                        >
                            REBOOT SYSTEM
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}
