
import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { RankedEngine, SubmissionResult } from '../../algowars/modes/ranked';
import { RankedMatchState, MatchPhase, RankedPlayerState, ProblemTemplate } from '../../algowars/types/ranked';
import { PROBLEM_TEMPLATES, getRandomProblem } from '../../algowars/content/templates';
import { TacticsHUD } from './TacticsHUD';
import BattlefieldBoard from './BattlefieldBoard';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Initial State
const INITIAL_PLAYER_ID = 'hero_player';
const INITIAL_STATE: RankedMatchState = {
    id: 'match_1',
    phase: MatchPhase.OPENING,
    startTime: Date.now(),
    players: {
        [INITIAL_PLAYER_ID]: {
            id: INITIAL_PLAYER_ID,
            clusterInfluence: { AGGRESSION: 0, CONTROL: 0, DECEPTION: 0, ENDGAME: 0 },
            activeTactics: [],
            solvedProblems: [],
            score: 0,
            energy: 100,
            currentProblemId: 'p_two_sum'
        },
        'opponent': {
            id: 'opponent',
            clusterInfluence: { AGGRESSION: 0, CONTROL: 1, DECEPTION: 0, ENDGAME: 0 },
            activeTactics: [],
            solvedProblems: [],
            score: 0,
            energy: 100
        }
    },
    problemSequence: [],
    timeLimit: 600,
    battlefield: { width: 0, height: 0, grid: [], units: [] } // Engine initializes this
};

export default function RankedMatchView() {
    // Force re-render on tick
    const [, setTick] = useState(0);
    const [engine] = useState(() => new RankedEngine(INITIAL_STATE));
    const [gameState, setGameState] = useState<RankedMatchState>(engine.getState());
    const [code, setCode] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [activeProblem, setActiveProblem] = useState<ProblemTemplate | null>(null);
    const [activeTab, setActiveTab] = useState<'problem' | 'battlefield'>('battlefield');

    // Sync state & Game Loop
    useEffect(() => {
        const interval = setInterval(() => {
            engine.tick(); // Run game logic
            setGameState({ ...engine.getState() });
            setTick(t => t + 1);
        }, 100); // 10 ticks per second
        return () => clearInterval(interval);
    }, [engine]);

    // Load problem
    useEffect(() => {
        const player = gameState.players[INITIAL_PLAYER_ID];
        if (player.currentProblemId) {
            const problem = PROBLEM_TEMPLATES[player.currentProblemId];
            if (problem && problem.id !== activeProblem?.id) {
                setActiveProblem(problem);
                setCode(problem.baseCode);
                setLogs([]);
            }
        } else {
            const nextMap: Record<number, string> = { 0: 'p_climb_stairs', 1: 'p_single_number', 2: 'p_max_subarray' };
            const nextId = nextMap[player.solvedProblems.length] || 'p_lru_cache';
            // Hacky state update for prototype
            player.currentProblemId = nextId;
        }
    }, [gameState.players[INITIAL_PLAYER_ID].solvedProblems.length, engine]);

    const handleRun = async () => {
        if (!activeProblem) return;
        setIsRunning(true);
        setLogs(prev => [...prev, 'Running tests...']);

        try {
            const results = activeProblem.testCases.map((tc, i) => {
                const wrapper = `
                    ${code}
                    // Test Case ${i}
                    const result = ${extractFunctionName(activeProblem.baseCode)}(${JSON.stringify(tc.input).slice(1, -1)});
                    return result;
                `;

                try {
                    const func = new Function(wrapper);
                    const res = func();
                    const expected = JSON.stringify(tc.output);
                    const actual = JSON.stringify(res);

                    if (actual === expected) return { pass: true };
                    return { pass: false, error: `Expected ${expected}, got ${actual}` };
                } catch (e: any) {
                    return { pass: false, error: e.message };
                }
            });

            const allPassed = results.every(r => r.pass);
            const errors = results.filter(r => !r.pass).map(r => r.error);

            if (allPassed) {
                setLogs(prev => [...prev, 'All tests passed! Submitting...']);

                const subResult: SubmissionResult = {
                    success: true,
                    logs: [],
                    runtimeMs: 50,
                    memoryBytes: 1024
                };

                const { accepted, tacticsActivated } = engine.submitSolution(INITIAL_PLAYER_ID, activeProblem.id, subResult);

                if (accepted) {
                    setLogs(prev => [...prev, 'Accepted!', ...tacticsActivated.map(t => `TACTIC ACTIVATED: ${t.name}`)]);
                    // Auto switch to battlefield to see spawn
                    setActiveTab('battlefield');
                }

            } else {
                setLogs(prev => [...prev, 'Tests failed:', ...errors as string[]]);
            }

        } catch (e: any) {
            setLogs(prev => [...prev, `Runtime Error: ${e.message}`]);
        } finally {
            setIsRunning(false);
        }
    };

    function extractFunctionName(code: string) {
        const match = code.match(/function\s+(\w+)/);
        if (match) return match[1];
        const classMatch = code.match(/class\s+(\w+)/);
        if (classMatch) return classMatch[1];
        return 'solution';
    }

    const playerState = gameState.players[INITIAL_PLAYER_ID];

    return (
        <div className="flex h-screen w-full bg-[#050505] text-cyan-100 overflow-hidden font-sans">

            {/* Left Panel: Battlefield & Problem */}
            <div className="w-[45%] flex flex-col border-r border-cyan-900/30 bg-slate-900/20">
                {/* Header / Tabs */}
                <div className="flex border-b border-cyan-900/30">
                    <button
                        onClick={() => setActiveTab('battlefield')}
                        className={`flex-1 py-3 text-sm font-bold tracking-wider transition-colors ${activeTab === 'battlefield' ? 'bg-cyan-900/20 text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        BATTLEFIELD
                    </button>
                    <button
                        onClick={() => setActiveTab('problem')}
                        className={`flex-1 py-3 text-sm font-bold tracking-wider transition-colors ${activeTab === 'problem' ? 'bg-cyan-900/20 text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        PROBLEM PROTOCOL
                    </button>
                </div>

                <div className="flex-1 overflow-hidden relative">
                    <AnimatePresence mode='wait'>
                        {activeTab === 'battlefield' ? (
                            <motion.div
                                key="battlefield"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="h-full p-4 flex flex-col"
                            >
                                <div className="mb-4 flex justify-between items-center">
                                    <div className="flex gap-4">
                                        <div className="text-xs">
                                            <span className="text-gray-500 block">ENERGY</span>
                                            <span className="text-xl font-mono text-cyan-400">{playerState.energy}</span>
                                        </div>
                                        <div className="text-xs">
                                            <span className="text-gray-500 block">UNITS</span>
                                            <span className="text-xl font-mono text-white">{gameState.battlefield.units.filter(u => u.ownerId === INITIAL_PLAYER_ID).length}</span>
                                        </div>
                                    </div>
                                    <div className="text-xs text-right">
                                        <span className="text-gray-500 block">PHASE</span>
                                        <span className="text-xl font-mono text-yellow-500">{gameState.phase}</span>
                                    </div>
                                </div>

                                <div className="flex-1 flex items-center justify-center">
                                    <BattlefieldBoard gameState={gameState} />
                                </div>

                                <div className="mt-4 p-3 bg-black/40 rounded border border-cyan-900/30 text-xs text-gray-400 font-mono">
                                    System Status: Online. Grid integrity 100%. Central Node Neutral.
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="problem"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="h-full overflow-y-auto p-6"
                            >
                                {activeProblem ? (
                                    <>
                                        <h2 className="text-2xl font-bold mb-4 text-white">{activeProblem.title}</h2>
                                        <div className="bg-cyan-900/10 p-4 rounded border-l-2 border-cyan-500 mb-6">
                                            <p className="text-gray-300 leading-relaxed">{activeProblem.description}</p>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-sm font-bold text-cyan-500 uppercase tracking-wider">Test Vectors</h3>
                                            {activeProblem.testCases.slice(0, 3).map((tc, i) => (
                                                <div key={i} className="bg-black/40 p-3 rounded border border-cyan-900/30 font-mono text-xs">
                                                    <div className="flex justify-between mb-1">
                                                        <span className="text-gray-500">INPUT</span>
                                                        <span className="text-cyan-200">{JSON.stringify(tc.input)}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">EXPECTED</span>
                                                        <span className="text-green-200">{JSON.stringify(tc.output)}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500 animate-pulse">
                                        Awaiting Problem Packet...
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Logs Console */}
                <div className="h-48 border-t border-cyan-900/30 bg-black p-2 font-mono text-xs overflow-y-auto">
                    {logs.length === 0 && <div className="text-gray-600 italic"> System logs ready...</div>}
                    {logs.map((log, i) => (
                        <div key={i} className="mb-1">
                            <span className="text-cyan-700 mr-2">[{new Date().toLocaleTimeString()}]</span>
                            <span className={log.includes('Error') ? 'text-red-400' : 'text-cyan-100'}>{log}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Middle: Code Editor */}
            <div className="flex-1 flex flex-col bg-[#1e1e1e]">
                <div className="flex items-center justify-between px-4 py-2 bg-[#252526] text-xs text-gray-400 border-b border-black">
                    <span>main.js</span>
                    <span>JavaScript Runtime</span>
                </div>
                <Editor
                    height="100%"
                    defaultLanguage="javascript"
                    language="javascript"
                    theme="vs-dark"
                    value={code}
                    onChange={(val) => setCode(val || '')}
                    options={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: 14,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        padding: { top: 20 },
                        lineNumbers: 'on',
                        renderLineHighlight: 'all',
                    }}
                />
                <div className="absolute top-4 right-80 z-10 flex gap-2">
                    {/* Floating Action Buttons could go here */}
                </div>
                <div className="p-4 bg-[#252526] border-t border-black flex justify-end gap-4">
                    <button
                        className="px-6 py-2 text-xs font-bold text-gray-400 hover:text-white transition-colors"
                        onClick={() => setCode(activeProblem?.baseCode || '')}
                    >
                        RESET CODE
                    </button>
                    <button
                        onClick={handleRun}
                        disabled={isRunning}
                        className={`px-8 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-bold rounded shadow-lg shadow-cyan-900/20 transition-all ${isRunning ? 'opacity-50 cursor-wait' : ''}`}
                    >
                        {isRunning ? 'EXECUTING...' : 'DEPLOY SOLUTION'}
                    </button>
                </div>
            </div>

            {/* Right Panel: HUD */}
            <div className="w-72 bg-slate-900/50 border-l border-cyan-900/30 p-4 flex flex-col gap-4">
                <TacticsHUD playerState={playerState} />

                <div className="p-4 bg-black/40 border border-red-900/30 rounded-lg">
                    <h3 className="text-xs font-bold text-red-400 mb-2 tracking-widest">OPPONENT SIGNAL</h3>
                    <div className="space-y-2">
                        <div className="h-1 bg-red-900/30 rounded overflow-hidden">
                            <div className="h-full bg-red-500 w-[45%]" />
                        </div>
                        <div className="flex justify-between text-[10px] text-red-300/50 uppercase">
                            <span>Activity</span>
                            <span>Coding...</span>
                        </div>
                    </div>
                </div>

                <div className="mt-auto opacity-50">
                    <div className="text-[10px] text-gray-600 text-center font-mono">
                        SECURE CONNECTION
                        <br />
                        LATENCY: 12ms
                    </div>
                </div>
            </div>
        </div>
    );
}
