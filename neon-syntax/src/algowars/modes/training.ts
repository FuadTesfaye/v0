
import { processTurn } from '../engine/engine';
import { GameState, PlayerId, UnitType, UnitId, Position, Action } from '../engine/types';
import { JavascriptRunner } from '../code-runner/javascript-runner';
import { PythonRunner } from '../code-runner/python-runner';
import { CodeRunner } from '../code-runner/runner';

// Simple bot interface
export interface Bot {
    name: string;
    language: 'javascript' | 'python'; // For now assume bots are also code strings or pre-compiled
    code: string;
}

// Scenarios define atomic challenges
export interface TrainingScenario {
    id: string;
    name: string;
    description: string;
    mapWidth: number;
    mapHeight: number;
    playerStart: Position;
    enemyStart: Position;
    maxTurns: number;
    botId: string; // The opponent ID
}

export interface MatchResult {
    winner: PlayerId | 'draw' | null;
    logs: string[];
    replay: GameState[]; // Array of states for replay
    error?: string;
}

// Mock Bot Registry
const BOTS: Record<string, Bot> = {
    'simple-bot': {
        name: 'Simple Bot',
        language: 'javascript', // easier to run
        code: `
      // Simple Move Down Bot
      const units = game.self.units;
      if (units.length > 0) {
        return { type: 'move', direction: 'down', unitId: units[0].id };
      }
      return { type: 'hold', unitId: units[0]?.id };
    `
    }
};

export class TrainingMode {
    private jsRunner = new JavascriptRunner();
    private pyRunner = new PythonRunner();

    async runMatch(
        playerCode: string,
        playerLang: 'javascript' | 'python',
        scenario: TrainingScenario
    ): Promise<MatchResult> {

        // 1. Setup Initial State
        const playerId = 'player';
        const botId = 'bot';

        let currentState: GameState = {
            matchId: `training_${Date.now()}`,
            turn: 0,
            maxTurns: scenario.maxTurns,
            map: { width: scenario.mapWidth, height: scenario.mapHeight, obstacles: [] },
            players: {
                [playerId]: { id: playerId, resources: 0, units: ['u_p'] },
                [botId]: { id: botId, resources: 0, units: ['u_b'] }
            },
            units: {
                'u_p': {
                    id: 'u_p', ownerId: playerId, type: UnitType.SOLDIER,
                    position: { ...scenario.playerStart },
                    hp: 100, maxHp: 100, energy: 10, maxEnergy: 10, damage: 10, range: 1
                },
                'u_b': {
                    id: 'u_b', ownerId: botId, type: UnitType.SOLDIER,
                    position: { ...scenario.enemyStart },
                    hp: 100, maxHp: 100, energy: 10, maxEnergy: 10, damage: 10, range: 1
                }
            },
            winner: null,
            logs: []
        };

        const replay: GameState[] = [structuredClone(currentState)];
        const bot = BOTS[scenario.botId];
        if (!bot) throw new Error(`Bot ${scenario.botId} not found`);

        // 2. Loop
        while (!currentState.winner && currentState.turn < currentState.maxTurns) {
            // Prepare Views
            const pView = this.createView(currentState, playerId);
            const bView = this.createView(currentState, botId);

            // Run Code
            // TODO: Parallel execution? For now sequential
            let pAction: Action | null = null;
            let bAction: Action | null = null;

            try {
                const runner = playerLang === 'javascript' ? this.jsRunner : this.pyRunner;
                pAction = await runner.run(playerCode, pView, 1000); // 1s timeout
            } catch (e: any) {
                // Player runtime error = Loss
                // Or store error log
                currentState.logs.push(`Player Logic Error: ${e.message}`);
                // Decide: Instant loss?
                // Let's say yes for strict mode, or just no-op action for lenient training
                // User request says: "If the code fails, the player fails."
                currentState.winner = botId;
                break;
            }

            try {
                // Bot run
                // Bots are trusted? Or ran normally. 
                // Training bot usually predefined logic.
                // We'll run it through runner for consistency.
                const botRunner = bot.language === 'javascript' ? this.jsRunner : this.pyRunner;
                bAction = await botRunner.run(bot.code, bView, 1000);
            } catch (e: any) {
                currentState.logs.push(`Bot Logic Error: ${e.message}`);
                // Bot crash? User wins?
                currentState.winner = playerId;
                break;
            }

            // Process Turn
            const actions: Record<PlayerId, Action[]> = {};
            if (pAction) actions[playerId] = [pAction];
            if (bAction) actions[botId] = [bAction];

            currentState = processTurn(currentState, actions);
            replay.push(structuredClone(currentState));
        }

        return {
            winner: currentState.winner,
            logs: currentState.logs,
            replay
        };
    }

    private createView(state: GameState, playerId: PlayerId) {
        // Naive full view for MVP + fog of war later
        const selfUnits = Object.values(state.units).filter(u => u.ownerId === playerId);
        const enemyUnits = Object.values(state.units).filter(u => u.ownerId !== playerId);

        // Simple visibility check (infinite range for now or map wide)
        // Implementation plan said: "Player's code returns a structured action object"
        // View structure aligned with types.ts
        return {
            self: {
                id: playerId,
                resources: state.players[playerId].resources,
                units: selfUnits
            },
            enemies: {
                lastSeen: [], // TODO: Fog of war memory
                units: enemyUnits // Fully visible for MVP
            },
            map: state.map,
            turn: state.turn
        };
    }
}
