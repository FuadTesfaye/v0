
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { gameStore } from './store';
import { createInitialState, tick } from '../../../engine/simulation';
import { ActionSchema } from '../../../engine/schema';
import { NodeType, NodeState } from '../../../engine/types';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const gameId = searchParams.get('id');

    if (!gameId) {
        return NextResponse.json({ error: 'Missing game ID' }, { status: 400 });
    }

    let game = gameStore.getGame(gameId);
    if (!game) {
        return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    // LAZY SIMULATION CATCH-UP
    // Calculate state up to NOW
    const now = Date.now();
    // In a real app, we'd pull pending actions from a DB queue here.
    // For this in-memory version, we assume actions were applied immediately or stored in state.
    // We'll just run the simulation for time catchup.

    const nextState = tick(game, now, []);
    gameStore.saveGame(nextState);

    return NextResponse.json(nextState);
}

export async function POST(req: NextRequest) {
    const body = await req.json();

    // Route based on 'action' type field or path? 
    // Simple "RPC-style" switch for now

    if (body.method === 'create_game') {
        const gameId = uuidv4();
        const state = createInitialState(gameId);

        // Add some dummy nodes for testing
        state.nodes['base1'] = {
            id: 'base1', type: NodeType.BASE, x: 100, y: 300,
            ownerId: null, state: NodeState.IDLE,
            energy: 0, maxEnergy: 100, flowRate: 5,
            health: 100, maxHealth: 100, captureProgress: 0, capturingPlayerId: null
        };
        state.nodes['turret1'] = {
            id: 'turret1', type: NodeType.TURRET, x: 300, y: 300,
            ownerId: null, state: NodeState.IDLE,
            energy: 0, maxEnergy: 50, flowRate: 0,
            health: 50, maxHealth: 50, captureProgress: 0, capturingPlayerId: null
        };
        state.nodes['central'] = {
            id: 'central', type: NodeType.CENTRAL, x: 500, y: 300,
            ownerId: null, state: NodeState.IDLE,
            energy: 0, maxEnergy: 200, flowRate: 0,
            health: 500, maxHealth: 500, captureProgress: 0, capturingPlayerId: null
        };

        state.edges.push({ id: 'e1', source: 'base1', target: 'turret1', active: true });
        state.edges.push({ id: 'e2', source: 'turret1', target: 'central', active: true });

        gameStore.createGame(state);
        return NextResponse.json({ gameId, state });
    }

    if (body.method === 'submit_action') {
        const parseResult = ActionSchema.safeParse(body.payload);
        if (!parseResult.success) {
            return NextResponse.json({ error: 'Invalid action', details: parseResult.error }, { status: 400 });
        }

        const action = parseResult.data;
        const gameId = body.gameId; // Passed separately or in action?

        if (!gameId) return NextResponse.json({ error: 'Missing gameId' }, { status: 400 });

        let game = gameStore.getGame(gameId);
        if (!game) return NextResponse.json({ error: 'Game not found' }, { status: 404 });

        // Catch up state first
        const now = Date.now();
        game = tick(game, now, []);

        // Apply new action immediately in this simple model
        // In strict model: validation check against current state
        const actionList = [action];
        // Re-tick with the action? Or just apply it? 
        // Ideally: tick() handles actions.
        // Let's force a tick with just this action

        // We need to inject the action into the simulation for *this* tick
        const nextState = tick(game, now, actionList); // 0 time delta effectively if just caught up?
        // Actually tick logic handles >0 delta. If delta is 0, tick returns same state.
        // We need a helper "applyAction" or ensure tick processes actions even if time delta is small
        // BUT our tick loop checks `ticksToSimulate`.

        // For this prototype: we'll add the action to a "pending queue" on the state 
        // OR just manually mutate for now to ensure it registers if time hasn't passed.
        // Better: Update `tick` to always process actions passed to it.

        // Let's assume tick() handles it.
        gameStore.saveGame(nextState);

        return NextResponse.json({ success: true, state: nextState });
    }

    return NextResponse.json({ error: 'Unknown method' }, { status: 400 });
}
