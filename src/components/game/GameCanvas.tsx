
'use client';

import React, { useRef, useEffect, useState } from 'react';
import { GameState, Node, Edge, NodeType, NodeState } from '../../engine/types';

interface GameCanvasProps {
    gameId: string;
}

export default function GameCanvas({ gameId }: GameCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Polling for state updates
    useEffect(() => {
        const fetchState = async () => {
            try {
                const res = await fetch(`/api/game?id=${gameId}`);
                if (!res.ok) throw new Error('Failed to fetch game state');
                const data = await res.json();
                setGameState(data);
            } catch (err) {
                console.error(err);
                setError('Connection lost');
            }
        };

        fetchState();
        const interval = setInterval(fetchState, 1000); // Poll every 1s
        return () => clearInterval(interval);
    }, [gameId]);

    // Main Render Loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !gameState) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw Edges
        gameState.edges.forEach(edge => {
            const source = gameState.nodes[edge.source];
            const target = gameState.nodes[edge.target];
            if (!source || !target) return;

            ctx.beginPath();
            ctx.moveTo(source.x, source.y);
            ctx.lineTo(target.x, target.y);
            ctx.strokeStyle = '#444';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Flow Animation (simple dot moving)
            if (edge.active && source.state === NodeState.OWNED) {
                const time = Date.now() / 1000;
                const offset = (time * 2) % 1;
                const flowX = source.x + (target.x - source.x) * offset;
                const flowY = source.y + (target.y - source.y) * offset;

                ctx.beginPath();
                ctx.arc(flowX, flowY, 4, 0, Math.PI * 2);
                ctx.fillStyle = '#0f0';
                ctx.fill();
            }
        });

        // Draw Nodes
        Object.values(gameState.nodes).forEach(node => {
            drawNode(ctx, node);
        });

    }, [gameState]);

    function drawNode(ctx: CanvasRenderingContext2D, node: Node) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);

        // Style based on State
        if (node.state === NodeState.OWNED) {
            ctx.fillStyle = '#00ff00'; // Player Color
        } else if (node.state === NodeState.CAPTURING) {
            ctx.fillStyle = '#ffff00';
        } else {
            ctx.fillStyle = '#333';
        }

        // Type indicator
        if (node.type === NodeType.BASE) ctx.strokeStyle = '#fff';
        else if (node.type === NodeType.CENTRAL) ctx.strokeStyle = '#f0f';
        else ctx.strokeStyle = '#888';

        ctx.lineWidth = 3;
        ctx.fill();
        ctx.stroke();

        // Health/Energy Bar
        ctx.fillStyle = 'white';
        ctx.font = '10px Arial';
        ctx.fillText(`${Math.floor(node.energy)}/${node.maxEnergy}`, node.x - 10, node.y + 30);
    }

    if (error) return <div className="text-red-500">{error}</div>;
    if (!gameState) return <div className="text-white">Loading Game...</div>;

    return (
        <div className="relative w-full h-full bg-black border border-gray-800 rounded-lg overflow-hidden">
            <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="block bg-grid-slate-900"
            />
            <div className="absolute top-2 left-2 text-green-400 font-mono text-xs">
                Tick: {gameState.tick} | ID: {gameId.slice(0, 8)}
            </div>
        </div>
    );
}
