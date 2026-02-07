
'use client';

import React, { useState, useEffect, useRef } from 'react';
import GameLayout from '../../../components/algowars/GameLayout';
import CodeEditor from '../../../components/algowars/CodeEditor';
import GameCanvas from '../../../components/algowars/GameCanvas';
import ConsolePanel from '../../../components/algowars/ConsolePanel';
import { runTrainingMatch, getScenario } from '../actions';
import { GameState, Unit, UnitType } from '../../../algowars/engine/types';

const DEFAULT_JS = `
// Available: game.self, game.enemies, game.map
// Return { type: 'move', direction: 'up' | 'down' | 'left' | 'right', unitId: ... }
// or { type: 'attack', targetId: ... }
// or { type: 'spawn', unitType: 'soldier', direction: ... }

const myUnits = game.self.units;
if (myUnits.length === 0) return { type: 'hold', unitId: '' };

const me = myUnits[0];
// Simple random movement
const dirs = ['up', 'down', 'left', 'right'];
const randomDir = dirs[Math.floor(Math.random() * dirs.length)];

return {
  type: 'move',
  direction: randomDir,
  unitId: me.id
};
`;

const DEFAULT_PY = `
# Available: game['self'], game['enemies'], game['map']
# Return a dict with 'type', 'direction', 'unitId' etc.

import random

def turn(game):
    my_units = game['self']['units']
    if not my_units:
        return { "type": "hold", "unitId": "" }
        
    me = my_units[0]
    dirs = ['up', 'down', 'left', 'right']
    random_dir = random.choice(dirs)
    
    return {
        "type": "move",
        "direction": random_dir,
        "unitId": me['id']
    }
`;

export default function TrainingPage() {
    // State
    const [language, setLanguage] = useState<'javascript' | 'python'>('javascript');
    const [code, setCode] = useState<string>(DEFAULT_JS);
    const [logs, setLogs] = useState<string[]>([]);
    const [isRunning, setIsRunning] = useState(false);

    // Simulation State
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [replay, setReplay] = useState<GameState[]>([]);
    const [replayIndex, setReplayIndex] = useState(0);
    const replayTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Load initial scenario (optional, or just wait for run)
    useEffect(() => {
        // We could fetch the initial state here to show the map before running
        getScenario().then(scenario => {
            // Create a dummy initial state for visualization if needed
            // For now we just wait for the user to run code
            setLogs(['System Ready. Awaiting Code...']);
        });
    }, []);

    // Handle Switch Language
    const handleLanguageChange = (lang: 'javascript' | 'python') => {
        setLanguage(lang);
        if (lang === 'javascript' && code === DEFAULT_PY) setCode(DEFAULT_JS);
        if (lang === 'python' && code === DEFAULT_JS) setCode(DEFAULT_PY);
    };

    // Run Match
    const handleRun = async () => {
        if (isRunning) return;

        setIsRunning(true);
        setLogs(['Compiling and Simulating...', ...logs]);

        // Clear previous replay
        if (replayTimerRef.current) clearInterval(replayTimerRef.current);
        setReplay([]);
        setReplayIndex(0);

        try {
            const result = await runTrainingMatch(code, language);

            if (result.error) {
                setLogs(prev => [...prev, `[ERROR] ${result.error}`]);
            } else {
                setLogs(prev => [...prev, ...result.logs, `Match execution complete. Replaying ${result.replay.length} turns.`]);
                setReplay(result.replay);
                if (result.replay.length > 0) {
                    setGameState(result.replay[0]);
                    startReplay(result.replay);
                }
            }
        } catch (e: any) {
            setLogs(prev => [...prev, `[CRITICAL_FAILURE] ${e.message}`]);
        } finally {
            setIsRunning(false);
        }
    };

    const startReplay = (replayData: GameState[]) => {
        let idx = 0;
        replayTimerRef.current = setInterval(() => {
            if (idx >= replayData.length) {
                if (replayTimerRef.current) clearInterval(replayTimerRef.current);
                setLogs(prev => [...prev, 'Replay Finished.']);
                return;
            }
            setGameState(replayData[idx]);
            setReplayIndex(idx);
            idx++;
        }, 500); // 500ms per turn
    };

    // Cleanup
    useEffect(() => {
        return () => {
            if (replayTimerRef.current) clearInterval(replayTimerRef.current);
        };
    }, []);

    return (
        <GameLayout
            editorSlot={
                <CodeEditor
                    code={code}
                    language={language}
                    onChange={(val) => setCode(val || '')}
                    onRun={handleRun}
                    onLanguageChange={handleLanguageChange}
                    readOnly={isRunning}
                />
            }
            gameSlot={
                <div className="flex flex-col items-center gap-4">
                    <GameCanvas gameState={gameState} width={600} height={600} />
                    {/* Status Bar */}
                    {gameState && (
                        <div className="flex gap-4 text-xs font-mono">
                            <div className="px-3 py-1 bg-slate-800 rounded text-cyan-400">
                                P1 UNITS: {Object.values(gameState.units).filter(u => u.ownerId === 'player').length}
                            </div>
                            <div className="px-3 py-1 bg-slate-800 rounded text-red-400">
                                ENEMY UNITS: {Object.values(gameState.units).filter(u => u.ownerId !== 'player').length}
                            </div>
                        </div>
                    )}
                </div>
            }
            consoleSlot={
                <ConsolePanel logs={logs} />
            }
        />
    );
}
