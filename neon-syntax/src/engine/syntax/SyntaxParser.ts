
export type ActionType = 'MOVE_UP' | 'MOVE_DOWN' | 'MOVE_LEFT' | 'MOVE_RIGHT' | 'DASH' | 'FLIP' | 'JUMP';

export interface ChainResult {
    isValid: boolean;
    name: string;
    scoreMultiplier: number;
    visualEffect?: 'glitch' | 'boost' | 'stabilize';
}

const CHAINS: Record<string, ChainResult> = {
    'MOVE_UP,MOVE_UP,DASH': {
        isValid: true,
        name: 'BREACH_CHAIN',
        scoreMultiplier: 1.5,
        visualEffect: 'boost'
    },
    'FLIP,DASH,FLIP': {
        isValid: true,
        name: 'GRAVITY_WEAVE',
        scoreMultiplier: 2.0,
        visualEffect: 'glitch'
    },
    'MOVE_LEFT,MOVE_RIGHT,MOVE_LEFT,MOVE_RIGHT': {
        isValid: true,
        name: 'OSCILLATION',
        scoreMultiplier: 1.2,
        visualEffect: 'stabilize'
    }
};

export class SyntaxParser {
    history: ActionType[] = [];
    maxHistory = 10;

    push(action: ActionType): ChainResult | null {
        this.history.push(action);
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }

        // Check for chains (suffix matching)
        // Convert history to string for simple matching
        const historyStr = this.history.join(',');

        for (const [pattern, result] of Object.entries(CHAINS)) {
            if (historyStr.endsWith(pattern)) {
                // Return match
                // We might clear history or leave it? Clearning prevents double counting
                this.history = [];
                return result;
            }
        }

        return null;
    }

    getDisplay(): string[] {
        return this.history;
    }
}
