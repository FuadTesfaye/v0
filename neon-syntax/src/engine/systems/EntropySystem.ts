
export class EntropySystem {
    value: number;
    thresholds = {
        GLITCH_START: 25,
        INTERCEPTOR_AND_HAZARD_SPAWN: 50,
        REALITY_LAYER_BREAK: 75,
        TOTAL_COLLAPSE: 95
    };

    constructor(initialValue = 0) {
        this.value = initialValue;
    }

    update(delta: number, playerPerformance: { speedMultiplier: number, chainLength: number }) {
        // Base increase over time
        let increase = 0.05 * delta;

        // Performance Multipliers
        // High speed = Higher Entropy (The faster you go, the more unstable reality becomes)
        if (playerPerformance.speedMultiplier > 1.2) {
            increase *= 2;
        }

        // Decay if player plays "Integrity" style (slow, methodical) - Not implemented yet
        // For now, Entropy always rises unless specific actions reduce it

        this.value = Math.min(100, this.value + increase);
    }

    getVisuaDistortionLevel(): number {
        if (this.value < 20) return 0;
        return (this.value - 20) / 80; // 0 to 1
    }

    shouldTriggerGlitch(): boolean {
        // Random chance based on entropy
        if (this.value < this.thresholds.GLITCH_START) return false;
        return Math.random() < (this.value / 1000); // 2.5% to 10% per tick
    }
}
