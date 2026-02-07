
'use client';

import React, { useRef, useEffect } from 'react';
import { GameState, Position, UnitType, Direction } from '../../algowars/engine/types';

interface GameCanvasProps {
    gameState: GameState | null;
    width?: number; // Canvas pixel width
    height?: number; // Canvas pixel height
}

const CELL_SIZE = 32;
const GRID_COLOR = '#1e293b'; // slate-800
const OBSTACLE_COLOR = '#475569'; // slate-600
const PLAYER_COLOR = '#06b6d4'; // cyan-500
const ENEMY_COLOR = '#ef4444'; // red-500

const GameCanvas: React.FC<GameCanvasProps> = ({ gameState, width = 600, height = 600 }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !gameState) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const mapWidth = gameState.map.width;
        const mapHeight = gameState.map.height;

        // Clear
        ctx.fillStyle = '#0f172a'; // slate-900
        ctx.fillRect(0, 0, width, height);

        // Draw Grid
        ctx.strokeStyle = GRID_COLOR;
        ctx.lineWidth = 1;
        for (let x = 0; x <= mapWidth; x++) {
            ctx.beginPath();
            ctx.moveTo(x * CELL_SIZE, 0);
            ctx.lineTo(x * CELL_SIZE, mapHeight * CELL_SIZE);
            ctx.stroke();
        }
        for (let y = 0; y <= mapHeight; y++) {
            ctx.beginPath();
            ctx.moveTo(0, y * CELL_SIZE);
            ctx.lineTo(mapWidth * CELL_SIZE, y * CELL_SIZE);
            ctx.stroke();
        }

        // Draw Obstacles
        ctx.fillStyle = OBSTACLE_COLOR;
        gameState.map.obstacles.forEach(obs => {
            ctx.fillRect(obs.x * CELL_SIZE + 2, obs.y * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);
        });

        // Draw Units
        Object.values(gameState.units).forEach(unit => {
            const isMyUnit = unit.ownerId === 'player'; // Hardcoded for training perspective MVP
            ctx.fillStyle = isMyUnit ? PLAYER_COLOR : ENEMY_COLOR;

            // Draw Circle for unit
            const cx = unit.position.x * CELL_SIZE + CELL_SIZE / 2;
            const cy = unit.position.y * CELL_SIZE + CELL_SIZE / 2;
            ctx.beginPath();
            ctx.arc(cx, cy, CELL_SIZE / 3, 0, Math.PI * 2);
            ctx.fill();

            // Draw Health Bar
            const hpPct = unit.hp / unit.maxHp;
            const barWidth = CELL_SIZE - 4;
            const barHeight = 4;
            ctx.fillStyle = '#334155';
            ctx.fillRect(unit.position.x * CELL_SIZE + 2, unit.position.y * CELL_SIZE - 6, barWidth, barHeight);
            ctx.fillStyle = hpPct > 0.5 ? '#22c55e' : '#ef4444';
            ctx.fillRect(unit.position.x * CELL_SIZE + 2, unit.position.y * CELL_SIZE - 6, barWidth * hpPct, barHeight);
        });

        // Retro visual effects overlay (scanlines)
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
        for (let y = 0; y < height; y += 4) {
            ctx.fillRect(0, y, width, 2);
        }

    }, [gameState, width, height]);

    if (!gameState) {
        return (
            <div className="flex items-center justify-center w-full h-full bg-slate-950 text-slate-500">
                NO SIGNAL
            </div>
        );
    }

    return (
        <div className="relative border-4 border-slate-800 rounded-lg overflow-hidden shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <canvas
                ref={canvasRef}
                width={gameState.map.width * CELL_SIZE}
                height={gameState.map.height * CELL_SIZE}
                className="block"
            />

            {/* Turn Counter Overlay */}
            <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 text-cyan-400 text-xs font-mono rounded border border-cyan-900">
                TURN: {gameState.turn.toString().padStart(3, '0')} / {gameState.maxTurns}
            </div>
        </div>
    );
};

export default GameCanvas;
