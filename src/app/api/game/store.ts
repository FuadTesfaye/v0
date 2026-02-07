
import { GameState } from '../../../engine/types';

// Simple in-memory store for development
// In production (Vercel), this would be replaced by Redis (Vercel KV) or Firestore.
// Since Next.js serverless functions are ephemeral, this static store 
// *might* persist if the lambda is warm, but is not reliable for prod.
// This is strictly for local dev/testing flows as requested.

class GameStore {
    private games: Map<string, GameState>;

    constructor() {
        this.games = new Map();
    }

    getGame(id: string): GameState | undefined {
        return this.games.get(id);
    }

    saveGame(state: GameState): void {
        this.games.set(state.id, state);
    }

    createGame(state: GameState): void {
        this.games.set(state.id, state);
    }

    getAllGames(): GameState[] {
        return Array.from(this.games.values());
    }
}

// Global singleton to persist across hot reloads in dev (mostly)
const globalForStore = global as unknown as { gameStore: GameStore };

export const gameStore = globalForStore.gameStore || new GameStore();

if (process.env.NODE_ENV !== 'production') globalForStore.gameStore = gameStore;
