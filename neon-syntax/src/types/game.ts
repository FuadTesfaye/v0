export type GameStage = 'BOOT' | 'MENU' | 'DIFFICULTY' | 'PLAYING' | 'PAUSED' | 'RESULTS';
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

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

    // Gameplay Stats
    score: number;
    combo: number;
    maxCombo: number;
    timer: number; // in milliseconds
    maxTimer: number;
    accuracy: number;
    totalAttempts: number;
    correctAttempts: number;

    // Active Snippet
    currentSnippet: Snippet | null;
    cursorIndex: number; // For non-free typing interaction

    // Settings
    audioEnabled: boolean;
    visualIntensity: number; // 0-1

    // Results
    lastRunSuccess: boolean;
    survivalTime: number;
}
