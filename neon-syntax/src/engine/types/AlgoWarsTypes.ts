
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

export interface AlgoWarsState {
    turn: number;
    board: BoardState;
    units: Unit[];
    resources: {
        energy: number;
        virusNodesAvailable: number;
    };
    status: 'PLAYING' | 'VICTORY' | 'DEFEAT';
    logs: string[];
}
