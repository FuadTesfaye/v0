
import { create } from 'zustand';
import {
    AlgoWarsState, Unit, Tile, UnitType, ActionType, Position, BoardState, TileType
} from '@/engine/types/AlgoWarsTypes';
import { BoardLogic } from '@/engine/logic/BoardLogic';
import { VirusLogic } from '@/engine/logic/VirusLogic';

interface GameActions {
    // Phase Control
    startGame: () => void;
    endTurn: () => void;
    endGame: (victory: boolean) => void;

    // Unit Actions
    moveUnit: (unitId: string, direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => void;
    spawnSoldier: () => void;
    placeVirusValues: (pos: Position) => void;

    // UI Helpers
    selectUnit: (unitId: string | null) => void;
    addLog: (message: string) => void;
}

type Store = AlgoWarsState & GameActions & {
    activeUnitId: string | null;
    selectionMode: 'NONE' | 'PLACE_VIRUS';
};

// Initial Setup Helper
const createInitialState = (): AlgoWarsState => {
    const boardLogic = new BoardLogic(8, 8);
    // Create Board
    const tiles: Tile[][] = Array(8).fill(null).map((_, x) =>
        Array(8).fill(null).map((_, y) => ({
            position: { x, y },
            type: 'NORMAL',
            isOccupied: false
        }))
    );

    // Initial Units
    const masterBot: Unit = {
        id: 'master-1',
        type: 'MASTER',
        owner: 'PLAYER',
        position: { x: 3, y: 7 },
        health: 100,
        maxHealth: 100,
        energy: 4, // Start with some energy
        actions: 2
    };

    const ratKing: Unit = {
        id: 'rat-king-1',
        type: 'RAT_KING',
        owner: 'ENEMY',
        position: { x: 3, y: 0 },
        health: 500,
        maxHealth: 500,
        energy: 0,
        actions: 2
    };

    // Mark occupancy
    tiles[3][7].isOccupied = true;
    tiles[3][7].unitId = masterBot.id;
    tiles[3][0].isOccupied = true;
    tiles[3][0].unitId = ratKing.id;

    // Initial Energy Spawns
    // using boardLogic helper requires reconstructing state which is messy here
    // Manual spawn for init
    tiles[1][3].type = 'ENERGY_NODE';
    tiles[6][4].type = 'ENERGY_NODE';

    return {
        turn: 1,
        board: { width: 8, height: 8, tiles },
        units: [masterBot, ratKing],
        resources: { energy: 4, virusNodesAvailable: 3 },
        status: 'PLAYING',
        logs: ['ALGO_WARS_INITIALIZED', 'OP_ORD_RECEIVED: ELIMINATE_RAT_KING']
    };
};

export const useGameStore = create<Store>((set, get) => ({
    ...createInitialState(),
    activeUnitId: null,
    selectionMode: 'NONE',

    startGame: () => set({ ...createInitialState(), activeUnitId: 'master-1' }),

    endTurn: () => {
        const { turn, resources, units, board } = get();
        get().addLog(`TURN ${turn} ENDED.`);

        // 1. Energy Decay
        const newEnergy = Math.max(0, resources.energy - 1);
        if (resources.energy > 0 && newEnergy < resources.energy) {
            get().addLog('ENERGY_DECAY: -1');
        }

        // 2. Refresh Actions
        const newUnits = units.map(u => ({ ...u, actions: u.type === 'MASTER' ? 2 : 1 }));

        // 3. Enemy Turn (Stub)
        // Move Rat King logic here
        get().addLog('ENEMY_PHASE_EXECUTING...');

        // 4. Spawn new Energy (Chance)
        // ...

        set({
            turn: turn + 1,
            resources: { ...resources, energy: newEnergy, virusNodesAvailable: 3 },
            units: newUnits
        });
    },

    endGame: (victory) => set({ status: victory ? 'VICTORY' : 'DEFEAT' }),

    moveUnit: (unitId, direction) => {
        const { units, board, resources } = get();
        const unitIndex = units.findIndex(u => u.id === unitId);
        if (unitIndex === -1) return;
        const unit = units[unitIndex];

        if (unit.actions <= 0) {
            get().addLog('ACTION_DEPLETED');
            return;
        }

        // Calculate Cost & Distance
        let moveCost = 1; // Action cost
        let energyCost = 0;
        let distance = 1;

        // Enhanced Movement Check (Master only)
        // For now, simple standard move

        let dx = 0, dy = 0;
        if (direction === 'UP') dy = -1;
        if (direction === 'DOWN') dy = 1;
        if (direction === 'LEFT') dx = -1;
        if (direction === 'RIGHT') dx = 1;

        const targetPos = { x: unit.position.x + dx, y: unit.position.y + dy };

        // Validation
        if (targetPos.x < 0 || targetPos.x >= board.width || targetPos.y < 0 || targetPos.y >= board.height) return;
        if (board.tiles[targetPos.x][targetPos.y].isOccupied || board.tiles[targetPos.x][targetPos.y].type === 'WALL') {
            get().addLog('MOVEMENT_BLOCKED');
            return;
        }

        // Execute Move
        const newUnits = [...units];
        const newTiles = board.tiles.map(row => row.map(t => ({ ...t }))); // Deep clone for safety

        // Clear old tile
        newTiles[unit.position.x][unit.position.y].isOccupied = false;
        newTiles[unit.position.x][unit.position.y].unitId = undefined;

        // Update new tile
        newTiles[targetPos.x][targetPos.y].isOccupied = true;
        newTiles[targetPos.x][targetPos.y].unitId = unit.id;

        // Energy Collection
        let gainedEnergy = 0;
        if (newTiles[targetPos.x][targetPos.y].type === 'ENERGY_NODE') {
            newTiles[targetPos.x][targetPos.y].type = 'NORMAL'; // Consume
            gainedEnergy = 2;
            get().addLog('ENERGY_ACQUIRED: +2');
        }

        newUnits[unitIndex] = {
            ...unit,
            position: targetPos,
            actions: unit.actions - 1
        };

        set({
            units: newUnits,
            board: { ...board, tiles: newTiles },
            resources: { ...resources, energy: resources.energy + gainedEnergy }
        });
    },

    spawnSoldier: () => {
        const { units, resources, board } = get();
        const master = units.find(u => u.type === 'MASTER'); // Assume player 1 master
        if (!master) return;

        if (resources.energy < 2) {
            get().addLog('INSUFFICIENT_ENERGY');
            return;
        }
        if (master.actions <= 0) {
            get().addLog('ACTION_DEPLETED');
            return;
        }

        // Find spawn spot
        // check adjacent
        const moves = [{ x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }];
        let spawnPos = null;
        for (const m of moves) {
            const p = { x: master.position.x + m.x, y: master.position.y + m.y };
            if (p.x >= 0 && p.x < board.width && p.y >= 0 && p.y < board.height) {
                if (!board.tiles[p.x][p.y].isOccupied && board.tiles[p.x][p.y].type === 'NORMAL') {
                    spawnPos = p;
                    break;
                }
            }
        }

        if (!spawnPos) {
            get().addLog('NO_SPAWN_LOCATION');
            return;
        }

        // Spawn
        const newSoldier: Unit = {
            id: `soldier-${Date.now()}`,
            type: 'SOLDIER',
            owner: 'PLAYER',
            position: spawnPos,
            health: 20,
            maxHealth: 20,
            energy: 0,
            actions: 1
        };

        // Update Board
        const newTiles = board.tiles.map(row => row.map(t => ({ ...t })));
        newTiles[spawnPos.x][spawnPos.y].isOccupied = true;
        newTiles[spawnPos.x][spawnPos.y].unitId = newSoldier.id;

        set({
            units: [...units, newSoldier],
            board: { ...board, tiles: newTiles },
            resources: { ...resources, energy: resources.energy - 2 },
            // Deduct action from Master? Or is spawning free if energy paid?
            // "Actions compete with each other" -> costs action slot
        });

        // Deduct action separately to avoid complex spread
        const masterIndex = units.findIndex(u => u.id === master.id);
        const updatedUnits = get().units; // re-get
        updatedUnits[masterIndex].actions -= 1;
        set({ units: updatedUnits });

        get().addLog('UNIT_DEPLOYED');
    },

    placeVirusValues: (pos) => {
        const { board, resources, units } = get();
        const master = units.find(u => u.type === 'MASTER');
        if (!master || master.actions <= 0) return;

        if (resources.virusNodesAvailable <= 0) {
            get().addLog('VIRUS_CACHE_EMPTY');
            return;
        }

        const logic = new VirusLogic();
        // Need active count?
        // logic.canPlaceVirus... 

        // Update Tile
        const newTiles = board.tiles.map(row => row.map(t => ({ ...t })));
        if (newTiles[pos.x][pos.y].type === 'NORMAL' && !newTiles[pos.x][pos.y].isOccupied) {
            newTiles[pos.x][pos.y].type = 'VIRUS_NODE';

            // Update State
            const masterIndex = units.findIndex(u => u.id === master.id);
            const newUnits = [...units];
            newUnits[masterIndex].actions -= 1;

            set({
                board: { ...board, tiles: newTiles },
                resources: { ...resources, virusNodesAvailable: resources.virusNodesAvailable - 1 },
                units: newUnits,
                selectionMode: 'NONE'
            });
            get().addLog('VIRUS_NODE_ESTABLISHED');
        } else {
            get().addLog('INVALID_PLACEMENT');
        }
    },

    selectUnit: (unitId) => set({ activeUnitId: unitId }),
    addLog: (message) => set(state => ({ logs: [message, ...state.logs].slice(0, 20) }))
}));

