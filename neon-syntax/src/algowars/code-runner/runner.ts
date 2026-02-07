
import { Action, PlayerView } from '../engine/types';

export interface CodeRunner {
    run(code: string, context: PlayerView, timeLimitMs: number): Promise<Action>;
}

export class RunnerError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'RunnerError';
    }
}
