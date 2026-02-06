export function generateEnergyTiles(gridSize: number): [number, number][] {
    const positions: [number, number][] = [];
    while (positions.length < 8) {
        const x = Math.floor(Math.random() * (gridSize - 4)) + 2;
        const y = Math.floor(Math.random() * (gridSize - 4)) + 2;
        if (x !== 10 || y !== 10) { // Avoid data node
            positions.push([x, y]);
        }
    }
    return positions;
}

export function tileSize(gridSize: number, canvasSize: number): number {
    return canvasSize / gridSize;
}

export function getTileColor(tileType: string, pulseTime: number): string {
    switch (tileType) {
        case 'data-node':
            return `rgba(255, 0, 255, ${0.6 + 0.3 * Math.sin(pulseTime / 200)})`;
        case 'energy':
            return 'rgba(0, 170, 255, 0.7)';
        default:
            return 'rgba(0, 255, 136, 0.1)';
    }
}
