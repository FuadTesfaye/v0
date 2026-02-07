
export enum ProblemCluster {
    AGGRESSION = 'AGGRESSION',
    CONTROL = 'CONTROL',
    DECEPTION = 'DECEPTION',
    ENDGAME = 'ENDGAME',
}

export enum MatchPhase {
    OPENING = 'OPENING',   // Early problems, speed & correctness
    MIDGAME = 'MIDGAME',   // Pattern recognition, adaptation
    ENDGAME = 'ENDGAME',   // Optimization, pressure, precision
}

export type TacticType =
    | 'BLITZ_PRESSURE'
    | 'IRON_WALL'
    | 'EXPLOIT_NET'
    | 'ENDGAME_LOCK';

export interface Tactic {
    id: string;
    type: TacticType;
    name: string;
    description: string;
    cluster: ProblemCluster;
    duration: number; // in seconds, or -1 for permanent until burned
    active: boolean;
    activationTime?: number;
}

export interface ProblemTemplate {
    id: string;
    title: string;
    description: string;
    cluster: ProblemCluster[];
    difficulty: number; // 1-10
    // In a real system, this would have generation logic. 
    // For now, we might just store static problem data or simple generators.
    baseCode: string;
    testCases: any[];
}

export interface RankedPlayerState {
    id: string;
    clusterInfluence: Record<ProblemCluster, number>;
    activeTactics: Tactic[]; // Max 2
    solvedProblems: string[]; // IDs of solved problems
    currentProblemId?: string;
    score: number;
    energy: number; // New: Currency for battlefield ops
}

// --- Battlefield Types ---

export enum TileType {
    EMPTY = 'empty',
    NEUTRAL = 'neutral',
    PLAYER_BASE = 'player_base',
    CENTRAL_NODE = 'central_node',
    RESOURCE = 'resource',
}

export interface BattlefieldTile {
    x: number;
    y: number;
    type: TileType;
    ownerId: string | null;  // null = neutral
    health: number;          // For walls/bases
    maxHealth: number;
}

export interface BattlefieldUnit {
    id: string;
    ownerId: string;
    type: 'scout' | 'soldier' | 'tank';
    x: number;
    y: number;
    health: number;
    maxHealth: number;
    damage: number;
    range: number;
    moveSpeed: number; // tiles per tick? or ticks per move?
    lastMoveTick: number;
}

export interface BattlefieldState {
    width: number;
    height: number;
    grid: BattlefieldTile[][];
    units: BattlefieldUnit[];
}

export interface RankedMatchState {
    id: string;
    phase: MatchPhase;
    startTime: number;
    players: Record<string, RankedPlayerState>; // keys are player IDs
    problemSequence: string[]; // IDs of problems for this match
    timeLimit: number; // Global match time limit or per-problem? Usually per-match in this context.

    // New: Battlefield
    battlefield: BattlefieldState;
}
