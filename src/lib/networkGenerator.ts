import { NetworkNode, Connection, PlayerNetworkState, DefenseLayer } from '@/types/network';

const NODE_NAMES = [
    'Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel', 'India', 'Juliet',
    'Kilo', 'Lima', 'Mike', 'November', 'Oscar', 'Papa', 'Quebec', 'Romeo', 'Sierra', 'Tango'
];

function generateDefenseLayers(complexity: number): DefenseLayer[] {
    const layers: DefenseLayer[] = [];
    const layerCount = Math.floor(Math.random() * complexity) + 1;

    for (let i = 0; i < layerCount; i++) {
        const types: DefenseLayer['type'][] = ['FIREWALL', 'ENCRYPTION', 'MONITOR'];
        layers.push({
            id: `layer-${Math.random().toString(36).substr(2, 9)}`,
            type: types[Math.floor(Math.random() * types.length)],
            strength: Math.random() * 0.5 + 0.2,
            active: true
        });
    }
    return layers;
}

export function generateNetwork(nodeCount: number = 10): { nodes: NetworkNode[], connections: Connection[] } {
    const nodes: NetworkNode[] = [];
    const connections: Connection[] = [];

    // 1. Generate Central Node
    const centralNode: NetworkNode = {
        id: 'central',
        name: 'CORE',
        type: 'CENTRAL',
        x: 50,
        y: 50,
        ownership: 'CENTRAL',
        defenseLayers: generateDefenseLayers(5),
        resources: { cpu: 100, data: 100 },
        alertLevel: 0
    };
    nodes.push(centralNode);

    // 2. Generate other nodes in a circle/web around central
    for (let i = 0; i < nodeCount - 1; i++) {
        const angle = (i / (nodeCount - 1)) * Math.PI * 2;
        const distance = 30 + Math.random() * 15;
        const x = 50 + Math.cos(angle) * distance;
        const y = 50 + Math.sin(angle) * distance;

        nodes.push({
            id: `node-${i}`,
            name: NODE_NAMES[i % NODE_NAMES.length],
            type: 'SERVER',
            x,
            y,
            ownership: 'NEUTRAL',
            defenseLayers: generateDefenseLayers(3),
            resources: { cpu: 10, data: 10 },
            alertLevel: 0
        });
    }

    // 3. Connect nodes (ensuring connectivity)
    // Connect each node to the central node or a nearby node
    for (let i = 1; i < nodes.length; i++) {
        // Connect to central with 50% probability
        if (Math.random() > 0.5) {
            connections.push({
                id: `conn-c-${i}`,
                fromId: nodes[i].id,
                toId: 'central',
                pulseRate: Math.random(),
                active: true
            });
        }

        // Connect to neighbor
        const nextIndex = i === nodes.length - 1 ? 1 : i + 1;
        connections.push({
            id: `conn-${i}-${nextIndex}`,
            fromId: nodes[i].id,
            toId: nodes[nextIndex].id,
            pulseRate: Math.random(),
            active: true
        });
    }

    return { nodes, connections };
}

export function getInitialPlayerState(startNodeId: string): PlayerNetworkState {
    return {
        currentNodeId: startNodeId,
        targetNodeId: null,
        movementProgress: 0,
        scripts: {
            brutal: 3,
            stealth: 5,
            logic: 10
        },
        resources: {
            cpu: 0,
            data: 0
        }
    };
}
