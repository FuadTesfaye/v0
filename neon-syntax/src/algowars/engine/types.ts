export type Position = {
    x: number;
    y: number;
};

export type PlayerId = string;
export type UnitId = string;

export enum UnitType {
    SOLDIER = 'soldier',
    BASE = 'base',
    RESOURCE = 'resource',
}

export interface Unit {
    id: UnitId;
    ownerId: PlayerId;
    type: UnitType;
    position: Position;
    hp: number;
    maxHp: number;
    energy: number;
    maxEnergy: number;
    damage: number;
    range: number;
}

export interface GameMap {
    width: number;
    height: number;
    obstacles: Position[];
}

export interface PlayerState {
    id: PlayerId;
    resources: number;
    units: UnitId[];
}

export interface GameState {
    matchId: string;
    turn: number;
    maxTurns: number;
    map: GameMap;
    players: Record<PlayerId, PlayerState>;
    units: Record<UnitId, Unit>;
    winner: PlayerId | null;
    logs: string[]; // Game logs for replay
}

export enum ActionType {
    MOVE = 'move',
    ATTACK = 'attack',
    SPAWN = 'spawn',
    TRANSFER = 'transfer',
    HOLD = 'hold'
}

export enum Direction {
    UP = 'up',
    DOWN = 'down',
    LEFT = 'left',
    RIGHT = 'right'
}

export interface BaseAction {
    type: ActionType;
    unitId: UnitId;
}

export interface MoveAction extends BaseAction {
    type: ActionType.MOVE;
    direction: Direction;
}

export interface AttackAction extends BaseAction {
    type: ActionType.ATTACK;
    targetId: UnitId;
}

export interface SpawnAction extends BaseAction {
    type: ActionType.SPAWN;
    unitType: UnitType;
    direction: Direction;
}

export type Action = MoveAction | AttackAction | SpawnAction | { type: ActionType.HOLD, unitId: UnitId };

// The view of the state sent to the player (sanitized/fog of war)
export interface PlayerView {
    self: {
        id: PlayerId;
        resources: number;
        units: Unit[];
    };
    enemies: {
        lastSeen: (Partial<Unit> & { position: Position })[];
        units: Unit[]; // Visible units
    };
    map: GameMap;
    turn: number;
}
