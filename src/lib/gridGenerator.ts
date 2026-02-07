import { Tile, TileType, Unit, UnitType, GridState } from '../types/grid';

export function generateGrid(width: number = 10, height: number = 10): GridState {
    const tiles: Tile[][] = [];

    for (let x = 0; x < width; x++) {
        tiles[x] = [];
        for (let y = 0; y < height; y++) {
            let type: TileType = 'NORMAL';
            const rand = Math.random();

            if (rand > 0.95) type = 'ENERGY';
            else if (rand > 0.90) type = 'TRAP';
            else if (rand > 0.85) type = 'VIRUS';

            tiles[x][y] = {
                x, y,
                type,
                revealed: false
            };
        }
    }

    // Place Central Data Node
    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);
    tiles[centerX][centerY].type = 'DATA_NODE';
    tiles[centerX][centerY].revealed = true; // Always visible for objective

    // Initial Units
    const units: Unit[] = [
        {
            id: 'p1-scout',
            owner: 'PLAYER',
            type: 'SCOUT',
            health: 50,
            maxHealth: 50,
            energy: 10,
            maxEnergy: 10,
            position: { x: 0, y: 0 },
            currentScript: ''
        },
        {
            id: 'e1-scout',
            owner: 'ENEMY',
            type: 'SCOUT',
            health: 50,
            maxHealth: 50,
            energy: 10,
            maxEnergy: 10,
            position: { x: width - 1, y: height - 1 },
            currentScript: ''
        }
    ];

    // Reveal area around player unit
    revealArea(tiles, units[0].position, 2);

    return {
        width,
        height,
        tiles,
        units,
        turn: 1
    };
}

export function revealArea(tiles: Tile[][], pos: { x: number, y: number }, radius: number) {
    for (let x = pos.x - radius; x <= pos.x + radius; x++) {
        for (let y = pos.y - radius; y <= pos.y + radius; y++) {
            if (tiles[x] && tiles[x][y]) {
                tiles[x][y].revealed = true;
            }
        }
    }
}
