
'use server';

import { TrainingMode, TrainingScenario, MatchResult } from '../../algowars/modes/training';

// Define a default scenario for now
const DEFAULT_SCENARIO: TrainingScenario = {
    id: 's1',
    name: 'First Contact',
    description: 'Approach the enemy unit.',
    mapWidth: 15,
    mapHeight: 15,
    playerStart: { x: 2, y: 7 },
    enemyStart: { x: 12, y: 7 },
    maxTurns: 30,
    botId: 'simple-bot'
};

export async function runTrainingMatch(code: string, language: 'javascript' | 'python'): Promise<MatchResult> {
    const training = new TrainingMode();
    try {
        const result = await training.runMatch(code, language, DEFAULT_SCENARIO);
        // Convert class instances to plain objects if needed for server action serialization
        return JSON.parse(JSON.stringify(result));
    } catch (e: any) {
        return {
            winner: null,
            logs: [`System Error: ${e.message}`],
            replay: [],
            error: e.message
        };
    }
}

export async function getScenario(): Promise<TrainingScenario> {
    return DEFAULT_SCENARIO;
}
