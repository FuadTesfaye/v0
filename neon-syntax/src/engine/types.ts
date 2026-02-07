export type NodeId = string;
export type PlayerId = string;

export enum NodeType {
  BASE = 'BASE',
  RESOURCE = 'RESOURCE',
  TURRET = 'TURRET',
  CENTRAL = 'CENTRAL', // The end-game goal
}

export enum NodeState {
  IDLE = 'IDLE',
  CAPTURING = 'CAPTURING',
  OWNED = 'OWNED',
  CONTESTED = 'CONTESTED',
}

export interface Node {
  id: NodeId;
  type: NodeType;
  ownerId: PlayerId | null;
  state: NodeState;
  
  // Resources
  energy: number;
  maxEnergy: number;
  flowRate: number; // Energy generated per tick
  
  // Combat/Capture
  health: number;
  maxHealth: number;
  captureProgress: number; // 0-100
  capturingPlayerId: PlayerId | null;

  // Position for visualization
  x: number;
  y: number;
}

export interface Edge {
  id: string; // usually source-target
  source: NodeId;
  target: NodeId;
  active: boolean; // Can transfer resources?
}

export interface Player {
  id: PlayerId;
  name: string;
  color: string;
  totalEnergy: number;
}

export enum ActionType {
  ATTACK = 'ATTACK', // Send energy to damage/capture a node
  FORTIFY = 'FORTIFY', // Send energy to repair/boost a node
  TRANSFER = 'TRANSFER', // Move energy between owned nodes
  SPAWN = 'SPAWN', // Spawn starting unit/base
}

export interface Action {
  type: ActionType;
  playerId: PlayerId;
  sourceId?: NodeId;
  targetId: NodeId;
  amount: number; // Energy amount
  timestamp: number;
}

export interface GameState {
  id: string;
  nodes: Record<NodeId, Node>;
  edges: Edge[];
  players: Record<PlayerId, Player>;
  tick: number;
  lastTickTimestamp: number;
  winner: PlayerId | null;
}
