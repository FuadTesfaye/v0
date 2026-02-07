export type TileType = 'NORMAL' | 'ENERGY' | 'TRAP' | 'VIRUS' | 'DATA_NODE';

export interface Tile {
    x: number;
    y: number;
    type: TileType;
    revealed: boolean;
    behavior?: string; // Serialized function for custom tile logic
}

export type UnitType = 'SCOUT' | 'ATTACK' | 'HACK';

export interface Unit {
    id: string;
    owner: 'PLAYER' | 'ENEMY';
    type: UnitType;
    health: number;
    maxHealth: number;
    energy: number;
    maxEnergy: number;
    position: { x: number; y: number };
    currentScript: string;
    lastError?: string;
}

export interface GridState {
    width: number;
    height: number;
    tiles: Tile[][];
    units: Unit[];
    turn: number;
}
