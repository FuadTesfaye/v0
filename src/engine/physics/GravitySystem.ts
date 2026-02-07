
export type GravityDirection = 'DOWN' | 'UP' | 'LEFT' | 'RIGHT';

export interface GravityState {
    vector: { x: number; y: number };
    direction: GravityDirection;
    strength: number; // 0.1 default
    isAnchored: boolean; // Temporarily immune to changes
}

export class GravitySystem {
    state: GravityState;

    constructor() {
        this.state = {
            vector: { x: 0, y: 1 }, // Default Down (positive Y)
            direction: 'DOWN',
            strength: 0.15,
            isAnchored: false
        };
    }

    flip() {
        if (this.state.isAnchored) return;

        this.state.vector.x *= -1;
        this.state.vector.y *= -1;

        // Update semantic direction
        if (this.state.direction === 'DOWN') this.state.direction = 'UP';
        else if (this.state.direction === 'UP') this.state.direction = 'DOWN';
        else if (this.state.direction === 'LEFT') this.state.direction = 'RIGHT';
        else if (this.state.direction === 'RIGHT') this.state.direction = 'LEFT';
    }

    rotate(clockwise: boolean = true) {
        if (this.state.isAnchored) return;

        // Simple 90deg rotation
        const oldX = this.state.vector.x;
        const oldY = this.state.vector.y;

        if (clockwise) {
            this.state.vector.x = -oldY;
            this.state.vector.y = oldX;
        } else {
            this.state.vector.x = oldY;
            this.state.vector.y = -oldX;
        }
    }

    setVector(x: number, y: number) {
        this.state.vector = { x, y };
    }
}
