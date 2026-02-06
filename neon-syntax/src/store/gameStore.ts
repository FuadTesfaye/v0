import { create } from 'zustand';
import type { GameState, GameStage, Difficulty, Snippet } from '@/types/game';

const SNIPPETS: Snippet[] = [
    {
        id: 's1',
        code: 'const x =  12;', // Double space error
        solution: 'const x = 12;',
        language: 'javascript',
        category: 'syntax',
        errorIndices: [10]
    },
    {
        id: 's2',
        code: 'function test() { retun true; }', // Typo in return
        solution: 'function test() { return true; }',
        language: 'javascript',
        category: 'syntax',
        errorIndices: [22]
    },
    {
        id: 's3',
        code: 'if (x ==  10) { }', // Double space
        solution: 'if (x == 10) { }',
        language: 'javascript',
        category: 'syntax',
        errorIndices: [9]
    }
];

interface GameActions {
    setStage: (stage: GameStage) => void;
    setDifficulty: (diff: Difficulty) => void;
    startGame: () => void;
    pauseGame: () => void;
    resumeGame: () => void;
    endGame: (victory?: boolean) => void;

    // Gameplay
    submitFix: (isCorrect: boolean) => void;
    updateTimer: (delta: number) => void;
    nextSnippet: () => void;

    // Settings
    toggleAudio: () => void;
}

type Store = GameState & GameActions;

export const useGameStore = create<Store>((set, get) => ({
    stage: 'BOOT',
    difficulty: 'EASY',
    score: 0,
    combo: 0,
    maxCombo: 0,
    timer: 30000,
    maxTimer: 30000,
    accuracy: 0,
    totalAttempts: 0,
    correctAttempts: 0,
    currentSnippet: null,
    cursorIndex: 0,
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
        set({
            stage: 'PLAYING',
            score: 0,
            combo: 0,
            maxCombo: 0,
            timer: maxTimer,
            totalAttempts: 0,
            correctAttempts: 0,
            accuracy: 0,
            survivalTime: 0
        });
        get().nextSnippet();
    },

    pauseGame: () => set({ stage: 'PAUSED' }),
    resumeGame: () => set({ stage: 'PLAYING' }),

    endGame: (victory = false) => {
        set({ stage: 'RESULTS', lastRunSuccess: victory });
    },

    nextSnippet: () => {
        const randomIndex = Math.floor(Math.random() * SNIPPETS.length);
        set({ currentSnippet: SNIPPETS[randomIndex] });
    },

    submitFix: (isCorrect) => {
        const state = get();
        const newTotal = state.totalAttempts + 1;
        const newCorrect = isCorrect ? state.correctAttempts + 1 : state.correctAttempts;
        const newCombo = isCorrect ? state.combo + 1 : 0;
        const newMaxCombo = Math.max(state.maxCombo, newCombo);

        // Time bonus/penalty
        const timeDelta = isCorrect ? 3000 : -5000;
        const newTimer = Math.max(0, Math.min(state.maxTimer, state.timer + timeDelta));

        set({
            totalAttempts: newTotal,
            correctAttempts: newCorrect,
            accuracy: (newCorrect / newTotal) * 100,
            combo: newCombo,
            maxCombo: newMaxCombo,
            score: Math.round(state.score + (isCorrect ? (100 * (1 + newCombo * 0.1)) : 0)),
            timer: newTimer
        });

        if (newTimer <= 0) {
            get().endGame(false);
        } else {
            get().nextSnippet();
        }
    },

    updateTimer: (delta) => {
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
