import { useGameStore } from '@/store/gameStore';

/**
 * A simple, safe-ish script executor that maps user commands to store actions.
 * Executes commands with a delay to show step-by-step movement.
 */
export async function executeScript(code: string): Promise<void> {
    const store = useGameStore.getState();

    // Custom API exposed to the user script
    const api = {
        move: async (direction: 'NORTH' | 'SOUTH' | 'EAST' | 'WEST') => {
            const dx = direction === 'EAST' ? 1 : direction === 'WEST' ? -1 : 0;
            const dy = direction === 'SOUTH' ? 1 : direction === 'NORTH' ? -1 : 0;

            const moved = store.moveRobot('player1', dx, dy);
            if (!moved) {
                throw new Error(`Movement failed toward ${direction}`);
            }

            // Artificial delay to visualize the movement
            await new Promise(resolve => setTimeout(resolve, 600));
        },

        scan: async () => {
            store.addLog('Scanning local sector...', 'info');
            await new Promise(resolve => setTimeout(resolve, 1000));
            store.addLog('Scan complete: Potential Data Node detected at [10, 10]', 'success');
        },

        wait: async (ms: number) => {
            store.addLog(`Waiting for ${ms}ms...`, 'info');
            await new Promise(resolve => setTimeout(resolve, ms));
        }
    };

    try {
        // Basic sandboxing: wrap user code in an async function and provide API
        // WARNING: Function constructor is NOT fully secure, but sufficient for Phase 1.
        const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
        const userScript = new AsyncFunction('api', code);

        await userScript(api);

        // Auto-end turn after script completion
        store.endTurn();

    } catch (err: any) {
        throw err;
    }
}
