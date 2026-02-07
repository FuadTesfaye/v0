
import { TrainingMode, TrainingScenario } from '../src/algowars/modes/training';

async function verifyTraining() {
    console.log('Starting Training Mode Verification...');

    const training = new TrainingMode();

    const scenario: TrainingScenario = {
        id: 's1',
        name: 'Basic Movement',
        description: 'Move to the enemy',
        mapWidth: 10,
        mapHeight: 10,
        playerStart: { x: 0, y: 0 },
        enemyStart: { x: 9, y: 9 },
        maxTurns: 20,
        botId: 'simple-bot'
    };

    // Player script: Move Diagonal towards 9,9
    // Simple heuristic: if x < 9 move right, if y < 9 move down
    const playerCode = `
    const me = game.self.units[0];
    const target = { x: 9, y: 9 };
    
    if (me.position.x < target.x) {
       return { type: 'move', direction: 'right', unitId: me.id }; 
    }
    if (me.position.y < target.y) {
       return { type: 'move', direction: 'down', unitId: me.id };
    }
    return { type: 'attack', targetId: 'u_b', unitId: me.id };
  `;

    try {
        const result = await training.runMatch(playerCode, 'javascript', scenario);
        console.log('Match Finished. Winner:', result.winner);
        console.log('Total Turns:', result.replay.length);

        if (result.replay.length > 1) {
            console.log('SUCCESS: Match simulated multiple turns.');
        } else {
            console.error('FAILURE: Match ended too early.');
            process.exit(1);
        }

        const finalState = result.replay[result.replay.length - 1];
        const pUnit = Object.values(finalState.units).find(u => u.ownerId === 'player');

        if (pUnit) {
            console.log(`Final Position: (${pUnit.position.x}, ${pUnit.position.y})`);
            if (pUnit.position.x > 0 || pUnit.position.y > 0) {
                console.log('SUCCESS: Player moved.');
            } else {
                console.error('FAILURE: Player did not move.');
                process.exit(1);
            }
        }

    } catch (e) {
        console.error('Verification Failed:', e);
        process.exit(1);
    }
}

verifyTraining();
