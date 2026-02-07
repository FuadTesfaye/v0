export type NodeOwnership = 'NEUTRAL' | 'PLAYER' | 'ENEMY' | 'CENTRAL';

export interface DefenseLayer {
    id: string;
    type: 'FIREWALL' | 'ENCRYPTION' | 'MONITOR';
    strength: number; // 0-1
    active: boolean;
}

export interface NetworkNode {
    id: string;
    name: string;
    type: 'SERVER' | 'CENTRAL';
    x: number; // 0-100 (percentage of map width)
    y: number; // 0-100 (percentage of map height)
    ownership: NodeOwnership;
    defenseLayers: DefenseLayer[];
    resources: {
        cpu: number;
        data: number;
    };
    alertLevel: number; // 0-1
}

export interface Connection {
    id: string;
    fromId: string;
    toId: string;
    pulseRate: number; // 0-1
    active: boolean;
}

export interface PlayerNetworkState {
    currentNodeId: string;
    targetNodeId: string | null;
    movementProgress: number; // 0-1
    scripts: {
        brutal: number;
        stealth: number;
        logic: number;
    };
    resources: {
        cpu: number;
        data: number;
    };
}
