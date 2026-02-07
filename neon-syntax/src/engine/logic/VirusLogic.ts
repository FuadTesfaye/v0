
import { BoardState, Position, Unit } from '../types/AlgoWarsTypes';

export class VirusLogic {
    // Placement Logic
    canPlaceVirus(board: BoardState, pos: Position, activeNodeCount: number): boolean {
        // Max 3 per round
        if (activeNodeCount >= 3) return false;

        const tile = board.tiles[pos.x][pos.y];

        // Not occupied, not special, not next to another Virus
        if (tile.isOccupied || tile.type !== 'NORMAL') return false;

        // Check neighbors for other Virus
        const neighbors = this.getNeighbors(pos, board.width, board.height);
        for (const n of neighbors) {
            if (board.tiles[n.x][n.y].type === 'VIRUS_NODE') return false;
        }

        return true;
    }

    // Trap Resolution Logic (Rat King Interaction)
    checkTrapCondition(board: BoardState, ratKing: Unit): boolean {
        const neighbors = this.getNeighbors(ratKing.position, board.width, board.height);

        // Check if ANY neighbor is a Virus Node
        const isNearVirus = neighbors.some(n => board.tiles[n.x][n.y].type === 'VIRUS_NODE');
        if (!isNearVirus) return false;

        // Check escape routes
        // A route is valid if it is NOT blocked (Occupied or Wall or Virus)
        // If ALL routes are blocked/hostile -> Trapped
        const escapeRoutes = neighbors.filter(n => {
            const tile = board.tiles[n.x][n.y];
            return tile.type !== 'WALL' && !tile.isOccupied && tile.type !== 'VIRUS_NODE' && tile.type !== 'TRAP_NODE';
        });

        // If 0 escape routes, trapped
        return escapeRoutes.length === 0;
    }

    getNeighbors(pos: Position, width: number, height: number): Position[] {
        const moves = [
            { x: 0, y: -1 }, { x: 0, y: 1 },
            { x: -1, y: 0 }, { x: 1, y: 0 }
        ];
        return moves
            .map(m => ({ x: pos.x + m.x, y: pos.y + m.y }))
            .filter(p => p.x >= 0 && p.x < width && p.y >= 0 && p.y < height);
    }
}
