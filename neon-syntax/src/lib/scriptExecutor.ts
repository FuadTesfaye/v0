import { useGameStore } from '@/store/gameStore';
import { ActionRequest } from '@/hooks/useScriptSandbox';

/**
 * A simple, safe-ish script executor that maps user commands to store actions.
 * Executes commands with a delay to show step-by-step movement.
 */
export async function executeScript(code: string): Promise<void> {
    const store = useGameStore.getState();
    const activeUnitId = store.activeUnitId;

    if (!activeUnitId) {
        store.addLog('ERROR: No active unit linked for script execution.', 'error');
        return;
    }

    // Custom API exposed to the user script
    const api = {
        move: async (direction: 'NORTH' | 'SOUTH' | 'EAST' | 'WEST') => {
            const action: ActionRequest = { type: 'MOVE', payload: direction };

            store.resolveTurn([{ unitId: activeUnitId, actions: [action] }]);

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
        const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
        const userScript = new AsyncFunction('api', code);

        await userScript(api);

    } catch (err: any) {
        store.addLog(`Script Error: ${err.message}`, 'error');
        throw err;
    }
}
