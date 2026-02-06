import { useCallback } from 'react';

export type ActionType = 'MOVE' | 'ATTACK' | 'SCAN' | 'SPAWN';

export interface ActionRequest {
    type: ActionType;
    payload: any;
}

export function useScriptSandbox() {
    const executeScript = useCallback((script: string): ActionRequest[] => {
        const actions: ActionRequest[] = [];

        const api = {
            move: (direction: 'NORTH' | 'SOUTH' | 'EAST' | 'WEST') => {
                actions.push({ type: 'MOVE', payload: direction });
            },
            attack: (targetId: string) => {
                actions.push({ type: 'ATTACK', payload: targetId });
            },
            scan: () => {
                actions.push({ type: 'SCAN', payload: null });
            },
            spawnTileBehavior: (x: number, y: number, behaviorFn: string) => {
                actions.push({ type: 'SPAWN', payload: { x, y, behaviorFn } });
            }
        };

        try {
            // Very basic "sandbox" for demo purposes. 
            // In a production app, this should be in a separate Web Worker or isolated iframe.
            const fn = new Function('api', script);
            fn(api);
        } catch (err) {
            console.error('Script Error:', err);
            throw err;
        }

        return actions;
    }, []);

    return { executeScript };
}
