
import {
    GameState,
    Action,
    ActionType,
    Unit,
    UnitType,
    Position,
    Direction,
    PlayerId,
    UnitId,
    BaseAction
} from './types';

// Helper to calculate next position
function getNextPosition(pos: Position, dir: Direction, width: number, height: number): Position {
    const next = { ...pos };
    switch (dir) {
        case Direction.UP: next.y = Math.max(0, pos.y - 1); break;
        case Direction.DOWN: next.y = Math.min(height - 1, pos.y + 1); break;
        case Direction.LEFT: next.x = Math.max(0, pos.x - 1); break;
        case Direction.RIGHT: next.x = Math.min(width - 1, pos.x + 1); break;
    }
    return next;
}

// Check if position is occupied by obstacle or unit
function isOccupied(pos: Position, state: GameState): boolean {
    // Check obstacles
    if (state.map.obstacles.some(o => o.x === pos.x && o.y === pos.y)) return true;
    // Check units
    if (Object.values(state.units).some(u => u.position.x === pos.x && u.position.y === pos.y)) return true;
    return false;
}

export function processTurn(state: GameState, actions: Record<PlayerId, Action[]>): GameState {
    const nextState = structuredClone(state);
    nextState.turn++;

    // 1. Process Actions
    // In a real simultaneous turn game, we need to resolve conflicts.
    // Priority: Move (if valid) > Attack > Spawn
    // Or: Randomize order if conflict?
    // Simplification: Process players in fixed order (or random seed based)

    // Flatten actions
    const allActions: { playerId: PlayerId, action: Action }[] = [];
    for (const [pid, acts] of Object.entries(actions)) {
        acts.forEach(a => allActions.push({ playerId: pid, action: a }));
    }

    // Shuffle actions ideally for fairness, but deterministic for now
    // sort by unit id to be deterministic
    allActions.sort((a, b) => a.action.unitId.localeCompare(b.action.unitId));

    for (const { playerId, action } of allActions) {
        applyAction(nextState, playerId, action);
    }

    // 2. Resource Generation
    // Every base generates resource
    for (const unit of Object.values(nextState.units)) {
        if (unit.type === UnitType.BASE) {
            if (nextState.players[unit.ownerId]) {
                nextState.players[unit.ownerId].resources += 1;
            }
        }
    }

    // 3. Check Win Condition
    // Elimination: access to 0 units
    for (const pid of Object.keys(nextState.players)) {
        const playerUnits = Object.values(nextState.units).filter(u => u.ownerId === pid);
        if (playerUnits.length === 0) {
            // Player eliminated
            // For 1v1, if one dies, other wins
            const other = Object.keys(nextState.players).find(id => id !== pid);
            if (other) nextState.winner = other;
        }
    }

    if (nextState.turn >= nextState.maxTurns && !nextState.winner) {
        // Draw or score based
        nextState.winner = 'draw';
    }

    return nextState;
}

function applyAction(state: GameState, playerId: PlayerId, action: Action) {
    const unit = state.units[action.unitId];

    // Validation 1: Unit exists
    if (!unit) return;
    // Validation 2: Unit belongs to player
    if (unit.ownerId !== playerId) return;

    // Execute Action
    switch (action.type) {
        case ActionType.MOVE: {
            // @ts-ignore - we know it's a MoveAction
            const dir = action.direction;
            const newPos = getNextPosition(unit.position, dir, state.map.width, state.map.height);

            if (!isOccupied(newPos, state)) {
                unit.position = newPos;
            }
            break;
        }
        case ActionType.ATTACK: {
            // @ts-ignore
            const targetId = action.targetId;
            const target = state.units[targetId];
            if (target) {
                // Range check (Manhattan distance)
                const dist = Math.abs(unit.position.x - target.position.x) + Math.abs(unit.position.y - target.position.y);
                if (dist <= unit.range) {
                    target.hp -= unit.damage;
                    if (target.hp <= 0) {
                        delete state.units[targetId];
                    }
                }
            }
            break;
        }
        case ActionType.SPAWN: {
            // Check resources first
            const cost = 10; // constant for now
            if (state.players[playerId].resources >= cost) {
                // spawn logic
                // @ts-ignore
                const dir = action.direction;
                const spawnPos = getNextPosition(unit.position, dir, state.map.width, state.map.height);
                if (!isOccupied(spawnPos, state)) {
                    const newId = `u_${Date.now()}_${Math.random()}`; // psuedo id
                    state.units[newId] = {
                        id: newId,
                        ownerId: playerId,
                        type: UnitType.SOLDIER,
                        position: spawnPos,
                        hp: 20,
                        maxHp: 20,
                        damage: 5,
                        range: 1,
                        energy: 10,
                        maxEnergy: 10
                    };
                    state.players[playerId].resources -= cost;
                }
            }
            break;
        }
    }
}
