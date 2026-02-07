import { useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';

export type ActionType = 'MOVE' | 'ATTACK' | 'SCAN' | 'SPAWN';

export interface ActionRequest {
    type: ActionType;
    payload: any;
}

export function useScriptSandbox() {
    const { board, units, activeUnitId } = useGameStore();

    const executeScript = useCallback(async (script: string, language: string): Promise<ActionRequest[]> => {
        // Context data preparation
        // In a real implementation, this would be sanitized and limited based on "fog of war"
        // For now, we pass a simplified READ-ONLY version of the grid state relative to the unit
        const activeUnit = units.find(u => u.id === activeUnitId);
        if (!activeUnit) throw new Error("No active unit for execution context");

        const context = {
            myUnit: { ...activeUnit },
            // Helper to scan for entities
            scan: (type?: string) => {
                // simple simulation of scanning nearby units
                return units
                    .filter(u => u.id !== activeUnitId) // exclude self
                    .map(u => ({ id: u.id, type: u.type, position: u.position }));
            },
            grid: { width: board.width, height: board.height }
        };

        const memory = {}; // TODO: Persistence

        if (language === 'python') {
            console.warn("Python runtime is not fully integrated in browser yet.");
            // Temporary Fake Execution for Python to allow flow testing
            // We can return a default move or try to regex parse simple return statements
            if (script.includes('return [{"type": "MOVE"')) {
                // Try to match basic move pattern manually for demo
                const moveMatch = script.match(/"direction":\s*"(\w+)"/);
                if (moveMatch) return [{ type: 'MOVE', payload: moveMatch[1] }];
            }
            throw new Error("Python Execution: Runtime not available (WASM pending). Please switch to JavaScript for full execution.");
        }

        // JavaScript Execution
        if (language === 'javascript') {
            try {
                // Transpile: Remove 'export' to make it a standard function definition
                const cleanScript = script.replace(/export\s+function\s+update/, 'function update');

                // Wrap in an IIFE that returns the result of update()
                const wrappedCode = `
                    ${cleanScript}
                    // Prevent context/memory leakage modification if possible (not secure in simple eval)
                    return update(context, memory);
                `;

                // Execute
                const fn = new Function('context', 'memory', wrappedCode);
                const result = fn(context, memory);

                // Validation
                if (!Array.isArray(result)) {
                    throw new Error("Script must return an array of actions");
                }

                // Map result to ActionRequest if needed, or validate structure
                return result.map((action: any) => ({
                    type: action.type,
                    payload: action.direction || action.target || action.payload // Normalize payload
                }));

            } catch (err: any) {
                console.error('Script Error:', err);
                if (err.message.includes('api is not defined')) {
                    throw new Error("Legacy API detected. Please reset your code to use the new 'export function update()' format.");
                }
                throw new Error(`Runtime Error: ${err.message}`);
            }
        }

        return [];
    }, [board, units, activeUnitId]);

    return { executeScript };
}
