import { create } from 'zustand';
import type { GameState, GameStage, Difficulty, Snippet } from '@/types/game';
import { generateGrid, revealArea } from '@/lib/gridGenerator';
import { GridState, Unit, Tile } from '@/types/grid';
import { ActionRequest } from '@/hooks/useScriptSandbox';

const SNIPPETS: Snippet[] = [
    // ... existing snippets
];

interface GameActions {
    setStage: (stage: GameStage) => void;
    setDifficulty: (diff: Difficulty) => void;
    setLanguage: (lang: GameState['language']) => void;
    startGame: () => void;
    pauseGame: () => void;
    resumeGame: () => void;
    endGame: (victory?: boolean) => void;

    // Grid Actions
    updateUnitScript: (unitId: string, script: string) => void;
    resolveTurn: (playerActions: Array<{ unitId: string, actions: ActionRequest[] }>) => void;
    selectUnit: (unitId: string | null) => void;
    addLog: (message: string, type?: 'info' | 'error' | 'success' | 'command') => void;
    setScriptRunning: (running: boolean) => void;
    updateTimer: (delta: number) => void;

    // Settings
    toggleAudio: () => void;
}

type Store = GameState & GameActions;

const initialGrid = generateGrid();

export const useGameStore = create<Store>((set, get) => ({
    stage: 'LANDING',
    difficulty: 'EASY',
    score: 0,
    combo: 0,
    maxCombo: 0,
    timer: 30000,
    maxTimer: 30000,
    accuracy: 0,
    totalAttempts: 0,
    correctAttempts: 0,
    language: null,
    grid: initialGrid,
    activeUnitId: initialGrid.units[0].id,
    scriptRunning: false,

    setLanguage: (language) => set({ language }),
    logs: [
        { id: 'init-1', message: 'NEURAL_LINK_ESTABLISHED', type: 'info', timestamp: Date.now() },
        { id: 'init-2', message: 'GRID_INITIALIZED_SECTOR_7', type: 'command', timestamp: Date.now() + 100 }
    ],
    currentSnippet: null,
    cursorIndex: 0,
    currentDialogue: {
        id: 'welcome',
        speaker: 'A.V.A',
        message: 'Neural link established. Sector 7 grid is live. Your scout is ready for code injection.'
    },
    audioEnabled: true,
    visualIntensity: 0.5,
    lastRunSuccess: false,
    survivalTime: 0,

    setStage: (stage) => set({ stage }),

    setDifficulty: (difficulty) => {
        let maxTimer = 30000;
        if (difficulty === 'MEDIUM') maxTimer = 20000;
        if (difficulty === 'HARD') maxTimer = 10000;
        set({ difficulty, maxTimer, timer: maxTimer });
    },

    startGame: () => {
        const { maxTimer } = get();
        const grid = generateGrid();
        set({
            stage: 'PLAYING',
            score: 0,
            combo: 0,
            maxCombo: 0,
            timer: maxTimer,
            totalAttempts: 0,
            correctAttempts: 0,
            accuracy: 0,
            survivalTime: 0,
            grid: grid,
            activeUnitId: grid.units[0].id,
            logs: [{ id: Math.random().toString(36).substring(2, 11), message: 'OPERATION_NEON_SYNTAX_STARTED', type: 'info', timestamp: Date.now() }]
        });
    },

    pauseGame: () => set({ stage: 'PAUSED' }),
    resumeGame: () => set({ stage: 'PLAYING' }),

    endGame: (victory = false) => {
        set({ stage: 'RESULTS', lastRunSuccess: victory });
    },

    updateUnitScript: (unitId, script) => {
        set(state => ({
            grid: {
                ...state.grid,
                units: state.grid.units.map(u =>
                    u.id === unitId ? { ...u, currentScript: script } : u
                )
            }
        }));
    },

    selectUnit: (unitId) => set({ activeUnitId: unitId }),

    resolveTurn: (playerActionGroups) => {
        const { grid } = get();
        get().addLog('RESOLVING_TURN...', 'command');

        set(state => {
            const newUnits = [...state.grid.units];
            const newTiles = [...state.grid.tiles];

            // 1. Process Movements
            playerActionGroups.forEach(group => {
                const unitIndex = newUnits.findIndex(u => u.id === group.unitId);
                if (unitIndex === -1) return;

                const unit = newUnits[unitIndex];
                group.actions.forEach(action => {
                    if (action.type === 'MOVE') {
                        const dir = action.payload;
                        let nx = unit.position.x;
                        let ny = unit.position.y;

                        if (dir === 'NORTH') ny--;
                        else if (dir === 'SOUTH') ny++;
                        else if (dir === 'EAST') nx++;
                        else if (dir === 'WEST') nx--;

                        // Bounds check
                        if (nx >= 0 && nx < state.grid.width && ny >= 0 && ny < state.grid.height) {
                            newUnits[unitIndex] = { ...unit, position: { x: nx, y: ny } };
                            // Reveal
                            revealArea(newTiles, { x: nx, y: ny }, 2);
                        }
                    }
                });
            });

            return {
                grid: {
                    ...state.grid,
                    units: newUnits,
                    tiles: newTiles,
                    turn: state.grid.turn + 1
                }
            };
        });
    },

    addLog: (message, type = 'info') => {
        set(state => ({
            logs: [{ id: Math.random().toString(36).substring(2, 11), message, type, timestamp: Date.now() }, ...state.logs].slice(0, 50)
        }));
    },

    setScriptRunning: (running) => set({ scriptRunning: running }),

    updateTimer: (delta: number) => {
        const { timer, stage } = get();
        if (stage !== 'PLAYING') return;

        const newTimer = Math.max(0, timer - delta);
        set({ timer: newTimer });

        if (newTimer <= 0) {
            get().endGame(false);
        }
    },

    toggleAudio: () => set(state => ({ audioEnabled: !state.audioEnabled }))
}));
