import { GridState } from './grid';

export type GameStage = 'BOOT' | 'LANDING' | 'LANGUAGE_SELECT' | 'MENU' | 'DIFFICULTY' | 'PLAYING' | 'PAUSED' | 'RESULTS';
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type Language = 'python' | 'javascript';

export interface Snippet {
    id: string;
    code: string;
    solution: string;
    language: string;
    category: string;
    errorIndices: number[]; // Indices of characters that need to be changed
}

export interface GameState {
    stage: GameStage;
    difficulty: Difficulty;
    language: Language | null;

    // Gameplay Stats
    score: number;
    combo: number;
    maxCombo: number;
    timer: number; // in milliseconds
    maxTimer: number;
    accuracy: number;
    totalAttempts: number;
    correctAttempts: number;

    // Grid State (New tactical engine)
    grid: GridState;
    activeUnitId: string | null;
    scriptRunning: boolean;
    logs: Array<{ id: string; message: string; type: 'info' | 'error' | 'success' | 'command'; timestamp: number }>;

    // Active Snippet
    currentSnippet: Snippet | null;
    cursorIndex: number; // For non-free typing interaction
    currentDialogue: { id: string, speaker: string, message: string } | null;

    // Settings
    audioEnabled: boolean;
    visualIntensity: number; // 0-1

    // Results
    lastRunSuccess: boolean;
    survivalTime: number;
}
