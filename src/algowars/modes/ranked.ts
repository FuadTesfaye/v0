
import {
    RankedMatchState,
    RankedPlayerState,
    ProblemCluster,
    Tactic,
    TacticType,
    MatchPhase,
    BattlefieldState,
    BattlefieldTile,
    BattlefieldUnit,
    TileType
} from '../types/ranked';

export interface SubmissionResult {
    success: boolean;
    logs: string[];
    runtimeMs: number;
    memoryBytes: number;
    error?: string;
}

export class RankedEngine {
    private state: RankedMatchState;

    constructor(state: RankedMatchState) {
        this.state = state;
        // Ensure battlefield is initialized if not already
        if (!this.state.battlefield || this.state.battlefield.grid.length === 0) {
            this.state.battlefield = this.initializeBattlefield(20, 10);
        }
    }

    public getState(): RankedMatchState {
        return this.state;
    }

    // --- Battlefield Initialization ---
    private initializeBattlefield(width: number, height: number): BattlefieldState {
        const grid: BattlefieldTile[][] = [];
        for (let y = 0; y < height; y++) {
            const row: BattlefieldTile[] = [];
            for (let x = 0; x < width; x++) {
                let type = TileType.EMPTY;
                let ownerId = null;

                // Bases
                if (x === 0 && y === Math.floor(height / 2)) {
                    type = TileType.PLAYER_BASE;
                    ownerId = 'player_1'; // Hardcoded for now, should be dyamic
                } else if (x === width - 1 && y === Math.floor(height / 2)) {
                    type = TileType.PLAYER_BASE;
                    ownerId = 'player_2';
                }

                // Central Node
                if (x === Math.floor(width / 2) && y === Math.floor(height / 2)) {
                    type = TileType.CENTRAL_NODE;
                }

                // Random Resources
                if (Math.random() > 0.9 && type === TileType.EMPTY) {
                    type = TileType.RESOURCE;
                }

                row.push({
                    x, y, type, ownerId, health: 100, maxHealth: 100
                });
            }
            grid.push(row);
        }

        return {
            width,
            height,
            grid,
            units: []
        };
    }

    public submitSolution(playerId: string, problemId: string, result: SubmissionResult): {
        accepted: boolean;
        tacticsActivated: Tactic[]
    } {
        const player = this.state.players[playerId];
        if (!player) throw new Error('Player not found');

        if (!result.success) {
            // Failed submission penalty: Lose energy
            player.energy = Math.max(0, player.energy - 10);
            return { accepted: false, tacticsActivated: [] };
        }

        // 1. Update Score & Solved Problems
        if (!player.solvedProblems.includes(problemId)) {
            player.solvedProblems.push(problemId);
            player.score += 100;
            // Successful solve grant energy
            player.energy += 50;
        }

        // 2. Identify Clusters
        const clusters = this.detectClusters(problemId, result);

        // 3. Update Cluster Influence
        clusters.forEach(c => {
            player.clusterInfluence[c] = (player.clusterInfluence[c] || 0) + 1;
        });

        // 4. Battlefield Effect: Spawn Unit
        // Determine unit type based on cluster
        // Aggression -> Soldier
        // Control -> Tank (high hp)
        // Deception -> Scout (fast)
        // Endgame -> Mega Unit?
        const mainCluster = clusters[0] || ProblemCluster.AGGRESSION;
        this.spawnUnitForCluster(playerId, mainCluster);

        // 5. Check Tactics
        const newTactics = this.checkTacticalActivation(player);

        // 6. Match Phase
        this.updateMatchPhase();

        return { accepted: true, tacticsActivated: newTactics };
    }

    private spawnUnitForCluster(playerId: string, cluster: ProblemCluster) {
        let type: 'scout' | 'soldier' | 'tank' = 'soldier';
        let hp = 50;
        let speed = 1;
        let range = 1;

        if (cluster === ProblemCluster.DECEPTION) {
            type = 'scout';
            hp = 30;
            speed = 2; // Fast
        } else if (cluster === ProblemCluster.CONTROL) {
            type = 'tank';
            hp = 120;
            speed = 0.5;
        }

        // Spawn location: Near base
        // Find base
        // Simplified: Player 1 Left (x=0), Player 2 Right (x=width-1)
        const isP1 = playerId === Object.keys(this.state.players)[0]; // naive check
        const spawnX = isP1 ? 1 : this.state.battlefield.width - 2;
        const spawnY = Math.floor(this.state.battlefield.height / 2); // mid

        const unit: BattlefieldUnit = {
            id: `u_${Date.now()}_${Math.random()}`,
            ownerId: playerId,
            type,
            x: spawnX,
            y: spawnY,
            health: hp,
            maxHealth: hp,
            damage: 10,
            range,
            moveSpeed: speed,
            lastMoveTick: Date.now()
        };

        this.state.battlefield.units.push(unit);
    }

    // --- Game Loop (Ticks) ---
    public tick() {
        // Move units
        // Simple AI: Move towards center
        const centerX = Math.floor(this.state.battlefield.width / 2);
        const centerY = Math.floor(this.state.battlefield.height / 2);

        this.state.battlefield.units.forEach(u => {
            // Move Logic
            // If enemy nearby, attack. Else move.
            // ... Simplified for prototype: Just move
            if (u.x < centerX) u.x++;
            else if (u.x > centerX) u.x--;

            // Limit bounds
            u.x = Math.max(0, Math.min(this.state.battlefield.width - 1, u.x));
            u.y = Math.max(0, Math.min(this.state.battlefield.height - 1, u.y));
        });
    }

    private detectClusters(problemId: string, result: SubmissionResult): ProblemCluster[] {
        // Mock: Random one for prototype
        return [ProblemCluster.AGGRESSION];
    }

    private checkTacticalActivation(player: RankedPlayerState): Tactic[] {
        const newlyActivated: Tactic[] = [];
        const ACTIVATION_THRESHOLD = 2;

        if (player.clusterInfluence[ProblemCluster.AGGRESSION] >= ACTIVATION_THRESHOLD) {
            this.tryActivateTactic(player, 'BLITZ_PRESSURE', newlyActivated);
        }
        if (player.clusterInfluence[ProblemCluster.CONTROL] >= ACTIVATION_THRESHOLD) {
            this.tryActivateTactic(player, 'IRON_WALL', newlyActivated);
        }
        if (player.clusterInfluence[ProblemCluster.DECEPTION] >= ACTIVATION_THRESHOLD) {
            this.tryActivateTactic(player, 'EXPLOIT_NET', newlyActivated);
        }
        if (player.clusterInfluence[ProblemCluster.ENDGAME] >= ACTIVATION_THRESHOLD) {
            this.tryActivateTactic(player, 'ENDGAME_LOCK', newlyActivated);
        }

        return newlyActivated;
    }

    private tryActivateTactic(player: RankedPlayerState, type: TacticType, list: Tactic[]) {
        if (player.activeTactics.some(t => t.type === type)) return;

        const tactic: Tactic = {
            id: `tactic_${Date.now()}_${Math.random()}`,
            type,
            name: type.replace('_', ' '),
            description: 'Tactical modifier active.',
            cluster: this.getClusterForTactic(type),
            duration: 60,
            active: true,
            activationTime: Date.now()
        };

        if (player.activeTactics.length >= 2) {
            player.activeTactics.shift();
        }

        player.activeTactics.push(tactic);
        list.push(tactic);
    }

    private getClusterForTactic(type: TacticType): ProblemCluster {
        switch (type) {
            case 'BLITZ_PRESSURE': return ProblemCluster.AGGRESSION;
            case 'IRON_WALL': return ProblemCluster.CONTROL;
            case 'EXPLOIT_NET': return ProblemCluster.DECEPTION;
            case 'ENDGAME_LOCK': return ProblemCluster.ENDGAME;
        }
    }

    private updateMatchPhase() {
        const totalSolved = Object.values(this.state.players)
            .reduce((acc, p) => acc + p.solvedProblems.length, 0);

        if (totalSolved > 10) {
            this.state.phase = MatchPhase.ENDGAME;
        } else if (totalSolved > 4) {
            this.state.phase = MatchPhase.MIDGAME;
        }
    }
}
