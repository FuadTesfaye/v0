
import {
    GameState,
    Node,
    Edge,
    Action,
    Player,
    NodeState,
    NodeType,
    ActionType
} from './types';

const TICK_RATE = 10;
const MS_PER_TICK = 1000 / TICK_RATE;

// Utility: Create initial game state
export function createInitialState(id: string): GameState {
    return {
        id,
        nodes: {},
        edges: [],
        players: {},
        tick: 0,
        lastTickTimestamp: Date.now(),
        winner: null,
    };
}

// Pure Function: Calculate next state based on time delta
export function tick(currentState: GameState, currentTimestamp: number, pendingActions: Action[]): GameState {
    const nextState = structuredClone(currentState);

    // Calculate how many ticks to simulate
    const deltaMs = currentTimestamp - nextState.lastTickTimestamp;
    const ticksToSimulate = Math.floor(deltaMs / MS_PER_TICK);

    if (ticksToSimulate <= 0) {
        return nextState; // No updates needed
    }

    // Process ticks
    for (let i = 0; i < ticksToSimulate; i++) {
        nextState.tick++;

        // 1. Process Actions
        // Filter actions that should happen valid for this tick window? 
        // For simplicity in this 'lazy' model, we assume pendingActions are for *this* catch-up period.
        // In a stricter model, we'd bucket actions by timestamp.
        processActions(nextState, pendingActions);

        // 2. Resource Generation
        processResources(nextState);

        // 3. Status/Combat Updates
        processNodeStates(nextState);

        // 4. Win Condition Check
        checkWinCondition(nextState);
    }

    nextState.lastTickTimestamp += ticksToSimulate * MS_PER_TICK;

    // Clear processed actions (in a real persistent system, we'd mark them as processed)
    // Here we assume the caller handles clearing the queue or we return processed IDs.

    return nextState;
}

function processActions(state: GameState, actions: Action[]) {
    // Sort by timestamp if needed, but for now just process order
    for (const action of actions) {
        // Only process if action timestamp is <= current simulated tick time?
        // For MVP lazy eval: expect caller to filter actions relevant to this batch.

        if (action.type === ActionType.SPAWN) {
            // Logic for spawning a new player base
            const node = state.nodes[action.targetId];
            if (node && node.type === NodeType.BASE && !node.ownerId) {
                node.ownerId = action.playerId;
                node.state = NodeState.OWNED;
                node.energy = 50;
            }
        }

        // ... Implement other actions (ATTACK, TRANSFER)
    }
}

function processResources(state: GameState) {
    // Generate energy for owned nodes
    for (const nodeId in state.nodes) {
        const node = state.nodes[nodeId];
        if (node.state === NodeState.OWNED && node.ownerId) {
            // Base generation
            if (node.energy < node.maxEnergy) {
                node.energy += node.flowRate;
                // Clamp
                if (node.energy > node.maxEnergy) node.energy = node.maxEnergy;
            }
        }
    }
}

function processNodeStates(state: GameState) {
    // Logic for capturing: 
    // If a node is being attacked (implied by transfer logic later), reduce health.
    // If health <= 0, ownership changes.

    for (const nodeId in state.nodes) {
        const node = state.nodes[nodeId];

        // Decay mechanism or passive logic
        if (node.state === NodeState.CAPTURING) {
            // capturing logic
        }
    }
}

function checkWinCondition(state: GameState) {
    // Check if Central Node is owned for X ticks
    const centralNodeId = Object.keys(state.nodes).find(id => state.nodes[id].type === NodeType.CENTRAL);
    if (centralNodeId) {
        const central = state.nodes[centralNodeId];
        if (central.state === NodeState.OWNED && central.ownerId) {
            // Increment hold timer (add to state if needed)
            // For now, instant win for testing
            state.winner = central.ownerId;
        }
    }
}
