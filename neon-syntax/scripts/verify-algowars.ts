
import { processTurn } from '../src/algowars/engine/engine';
import { GameState, UnitType, Direction, ActionType, PlayerId } from '../src/algowars/engine/types';
import { JavascriptRunner } from '../src/algowars/code-runner/javascript-runner';
import { PythonRunner } from '../src/algowars/code-runner/python-runner';

// Mock State
const initialState: GameState = {
    matchId: 'test-match',
    turn: 0,
    maxTurns: 10,
    map: { width: 10, height: 10, obstacles: [] },
    players: {
        'p1': { id: 'p1', resources: 10, units: ['u1'] },
        'p2': { id: 'p2', resources: 10, units: ['u2'] }
    },
    units: {
        'u1': {
            id: 'u1', ownerId: 'p1', type: UnitType.SOLDIER,
            position: { x: 5, y: 5 },
            hp: 100, maxHp: 100, energy: 10, maxEnergy: 10, damage: 10, range: 1
        },
        'u2': {
            id: 'u2', ownerId: 'p2', type: UnitType.SOLDIER,
            position: { x: 5, y: 8 },
            hp: 100, maxHp: 100, energy: 10, maxEnergy: 10, damage: 10, range: 1
        }
    },
    winner: null,
    logs: []
};

async function verify() {
    console.log('Starting AlgoWars Verification...');

    const jsRunner = new JavascriptRunner();
    const pyRunner = new PythonRunner();

    // Test JS: Move UP
    // NOTE: In the runner we wrap the code, so return is enough if it's a script body
    const jsCode = `
    const myUnit = game.self.units[0];
    return {
      type: 'move',
      direction: 'up',
      unitId: myUnit.id
    };
  `;

    // Test Python: Move DOWN
    const pyCode = `
def turn(game_state):
    my_unit = game_state['self']['units'][0]
    return {
        "type": "move",
        "direction": "down",
        "unitId": my_unit['id']
    }
`;

    // Construct Player Views (Mocking the view generation for now)
    const p1View = {
        self: { id: 'p1', resources: 10, units: [initialState.units['u1']] },
        enemies: { lastSeen: [], units: [initialState.units['u2']] },
        map: initialState.map,
        turn: 0
    };

    const p2View = {
        self: { id: 'p2', resources: 10, units: [initialState.units['u2']] },
        enemies: { lastSeen: [], units: [initialState.units['u1']] },
        map: initialState.map,
        turn: 0
    };

    try {
        console.log('Running JS Code for P1...');
        const result1 = await jsRunner.run(jsCode, p1View, 1000);
        console.log('P1 Action:', result1);

        console.log('Running Python Code for P2...');
        const result2 = await pyRunner.run(pyCode, p2View, 1000);
        console.log('P2 Action:', result2);

        console.log('Processing Turn...');
        const nextState = processTurn(initialState, {
            'p1': [result1],
            'p2': [result2]
        });

        // Verification
        const u1 = nextState.units['u1'];
        const u2 = nextState.units['u2'];

        console.log(`U1 Position: (${u1.position.x}, ${u1.position.y})`);
        console.log(`U2 Position: (${u2.position.x}, ${u2.position.y})`);

        const p1Passed = u1.position.x === 5 && u1.position.y === 4; // Moved UP (y-1)
        const p2Passed = u2.position.x === 5 && u2.position.y === 9; // Moved DOWN (y+1)

        if (p1Passed && p2Passed) {
            console.log('SUCCESS: Both units moved as expected.');
        } else {
            console.error('FAILURE: Positions mismatch.');
            if (!p1Passed) console.error('P1 Failed move UP');
            if (!p2Passed) console.error('P2 Failed move DOWN');
            process.exit(1);
        }

    } catch (error) {
        console.error('Verification Failed:', error);
        process.exit(1);
    }
}

verify();
