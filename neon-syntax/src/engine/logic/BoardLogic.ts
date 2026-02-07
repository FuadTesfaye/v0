
import { BoardState, Position, TileType, Unit } from '../types/AlgoWarsTypes';

export class BoardLogic {
    width: number;
    height: number;
    tiles: TileType[][]; // Simple type map for logic

    constructor(width = 8, height = 8) {
        this.width = width;
        this.height = height;
        this.tiles = Array(width).fill(null).map(() => Array(height).fill('NORMAL'));
    }

    isValidPosition(pos: Position): boolean {
        return pos.x >= 0 && pos.x < this.width && pos.y >= 0 && pos.y < this.height;
    }

    isBlocked(board: BoardState, pos: Position): boolean {
        if (!this.isValidPosition(pos)) return true;
        const tile = board.tiles[pos.x][pos.y];
        return tile.type === 'WALL' || tile.isOccupied;
    }

    // Spawn Energy Tiles
    spawnEnergy(board: BoardState, count = 1): void {
        let placed = 0;
        let attempts = 0;

        while (placed < count && attempts < 50) {
            const x = Math.floor(Math.random() * this.width);
            const y = Math.floor(Math.random() * this.height);
            const tile = board.tiles[x][y];

            // Validation: Empty, Normal, Not adjacent to special
            if (tile.type === 'NORMAL' && !tile.isOccupied && !this.hasAdjacentSpecial(board, { x, y })) {
                tile.type = 'ENERGY_NODE';
                tile.metadata = { turnsUntilDecay: 5 };
                placed++;
            }
            attempts++;
        }
    }

    hasAdjacentSpecial(board: BoardState, pos: Position): boolean {
        const neighbors = this.getNeighbors(pos);
        return neighbors.some(n => {
            const t = board.tiles[n.x][n.y].type;
            return t === 'ENERGY_NODE' || t === 'VIRUS_NODE' || t === 'TRAP_NODE';
        });
    }

    getNeighbors(pos: Position): Position[] {
        const moves = [
            { x: 0, y: -1 }, { x: 0, y: 1 },
            { x: -1, y: 0 }, { x: 1, y: 0 }
        ]; // No diagonals for adjacency logic

        return moves
            .map(m => ({ x: pos.x + m.x, y: pos.y + m.y }))
            .filter(p => this.isValidPosition(p));
    }
}
