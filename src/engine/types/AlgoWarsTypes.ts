
export type UnitType = 'MASTER' | 'SOLDIER' | 'RAT_KING';
export type TileType = 'NORMAL' | 'ENERGY_NODE' | 'VIRUS_NODE' | 'TRAP_NODE' | 'WALL';

export type ActionType = 'MOVE' | 'ATTACK' | 'SPAWN' | 'PLACE_VIRUS' | 'WAIT';

export interface Position {
    x: number;
    y: number;
}

export interface Unit {
    id: string;
    type: UnitType;
    owner: 'PLAYER' | 'ENEMY';
    position: Position;
    health: number;
    maxHealth: number;
    energy: number; // For Master Bot
    actions: number; // Action slots per turn
    currentScript?: string;
}

export interface Tile {
    position: Position;
    type: TileType;
    isOccupied: boolean;
    unitId?: string;
    metadata?: {
        turnsUntilDecay?: number; // Energy Node decay
        trapActive?: boolean;     // Trap logic
    };
}

export interface BoardState {
    width: number;
    height: number;
    tiles: Tile[][];
}

export interface LogEntry {
    id: string;
    message: string;
    type: 'info' | 'error' | 'success' | 'command';
    timestamp: number;
}

export interface Dialogue {
    id: string;
    speaker: string;
    message: string;
    avatar?: string;
}

export interface AlgoWarsState {
    turn: number;
    board: BoardState;
    units: Unit[];
    currentDialogue: Dialogue | null;
    resources: {
        energy: number;
        virusNodesAvailable: number;
    };
    stage: 'BOOT' | 'MENU' | 'GAME';
    language: 'python' | 'javascript';
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    status: 'PLAYING' | 'VICTORY' | 'DEFEAT';
    score: number;
    accuracy: number;
    maxCombo: number;
    lastRunSuccess: boolean;
    logs: LogEntry[];
}
