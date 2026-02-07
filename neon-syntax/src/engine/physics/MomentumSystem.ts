
export interface Vector2 {
    x: number;
    y: number;
}

export interface MomentumState {
    position: Vector2;
    velocity: Vector2; // Grid cells per tick
    acceleration: Vector2;
    friction: number; // 0.8-0.95 usually
    maxSpeed: number;
}

export class MomentumSystem {
    state: MomentumState;

    constructor(initialPos: Vector2) {
        this.state = {
            position: { ...initialPos },
            velocity: { x: 0, y: 0 },
            acceleration: { x: 0, y: 0 },
            friction: 0.9,
            maxSpeed: 0.8 // Cap speed to prevent phasing through walls too easily without robust CCD
        };
    }

    applyForce(force: Vector2) {
        this.state.acceleration.x += force.x;
        this.state.acceleration.y += force.y;
    }

    update() {
        // Apply acceleration to velocity
        this.state.velocity.x += this.state.acceleration.x;
        this.state.velocity.y += this.state.acceleration.y;

        // Apply friction
        this.state.velocity.x *= this.state.friction;
        this.state.velocity.y *= this.state.friction;

        // Clamp speed
        const speed = Math.sqrt(this.state.velocity.x ** 2 + this.state.velocity.y ** 2);
        if (speed > this.state.maxSpeed) {
            const scale = this.state.maxSpeed / speed;
            this.state.velocity.x *= scale;
            this.state.velocity.y *= scale;
        }

        // Apply visual position (sub-pixel)
        this.state.position.x += this.state.velocity.x;
        this.state.position.y += this.state.velocity.y;

        // Reset acceleration
        this.state.acceleration.x = 0;
        this.state.acceleration.y = 0;
    }

    getGridPosition(): Vector2 {
        return {
            x: Math.round(this.state.position.x),
            y: Math.round(this.state.position.y)
        };
    }

    getSpeedRatio(): number {
        const speed = Math.sqrt(this.state.velocity.x ** 2 + this.state.velocity.y ** 2);
        return Math.min(1, speed / this.state.maxSpeed);
    }
}
