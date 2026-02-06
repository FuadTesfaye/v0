'use client';
import { useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { tileSize, getTileColor } from '@/lib/utils';
import type { Robot } from '@/types/game';

interface GridCanvasProps {
    size?: number;
}

export default function GridCanvas({ size = 500 }: GridCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { gridSize, tiles, robots, turn, gameWon, victoryMessage } = useGameStore();

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const tileSizePx = tileSize(gridSize, size);
        const time = Date.now();

        // Clear with cyberpunk gradient background
        const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size);
        gradient.addColorStop(0, 'rgba(0, 255, 136, 0.05)');
        gradient.addColorStop(0.5, 'rgba(138, 43, 226, 0.03)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);

        // Draw grid lines with neon glow
        ctx.strokeStyle = 'rgba(0, 255, 136, 0.3)';
        ctx.lineWidth = 1;
        ctx.shadowColor = '#00ff88';
        ctx.shadowBlur = 8;

        for (let x = 0; x < gridSize; x++) {
            for (let y = 0; y < gridSize; y++) {
                ctx.strokeRect(
                    x * tileSizePx,
                    y * tileSizePx,
                    tileSizePx,
                    tileSizePx
                );
            }
        }
        ctx.shadowBlur = 0;

        // Draw tiles
        for (let x = 0; x < gridSize; x++) {
            for (let y = 0; y < gridSize; y++) {
                const tile = tiles[x]?.[y];
                if (tile && tile.type !== 'normal') {
                    ctx.shadowColor = getTileColor(tile.type, time).replace('0.', '1.');
                    ctx.shadowBlur = 12;

                    const color = getTileColor(tile.type, time);
                    ctx.fillStyle = color;
                    ctx.fillRect(
                        x * tileSizePx + 2,
                        y * tileSizePx + 2,
                        tileSizePx - 4,
                        tileSizePx - 4
                    );
                    ctx.shadowBlur = 0;
                }
            }
        }

        // Draw robots
        robots.forEach((robot: Robot) => {
            const rx = (robot.position.x + 0.5) * tileSizePx;
            const ry = (robot.position.y + 0.5) * tileSizePx;

            // Main robot body with pulse
            const pulse = 0.3 + 0.1 * Math.sin(time / 300);
            ctx.save();
            ctx.translate(rx, ry);

            // Glow shadow
            ctx.shadowColor = '#ff00ff';
            ctx.shadowBlur = 20;

            // Robot circle
            ctx.fillStyle = '#ff00ff';
            ctx.beginPath();
            ctx.arc(0, 0, tileSizePx * pulse, 0, Math.PI * 2);
            ctx.fill();

            // Robot core glow
            const coreGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, tileSizePx * pulse);
            coreGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
            coreGradient.addColorStop(0.7, 'rgba(255, 0, 255, 0.4)');
            coreGradient.addColorStop(1, 'rgba(255, 0, 255, 0)');
            ctx.shadowBlur = 10;
            ctx.fillStyle = coreGradient;
            ctx.beginPath();
            ctx.arc(0, 0, tileSizePx * pulse * 0.6, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();

            // Energy bar
            const barWidth = tileSizePx * 0.8;
            const barHeight = 6;
            const energyPercent = robot.energy / robot.maxEnergy;

            ctx.fillStyle = `rgba(255, 0, 0, 0.3)`;
            ctx.fillRect(
                rx - barWidth / 2,
                ry - tileSizePx * 0.4,
                barWidth,
                barHeight
            );

            ctx.shadowColor = '#00ff41';
            ctx.shadowBlur = 8;
            ctx.fillStyle = `rgba(0, 255, 65, ${energyPercent > 0 ? 0.8 : 0.2})`;
            ctx.fillRect(
                rx - barWidth / 2,
                ry - tileSizePx * 0.4,
                barWidth * energyPercent,
                barHeight
            );
            ctx.shadowBlur = 0;
        });

        // Victory overlay
        if (gameWon && victoryMessage) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, size, size);

            ctx.fillStyle = '#00ff88';
            ctx.shadowColor = '#00ff88';
            ctx.shadowBlur = 20;
            ctx.font = `${Math.min(size / 12, 48)}px Courier New, monospace`; // Using Courier New since Orbitron might not be loaded yet
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(victoryMessage, size / 2, size / 2);
            ctx.shadowBlur = 0;
        }
    }, [gridSize, tiles, robots, size, turn, gameWon, victoryMessage]);

    useEffect(() => {
        let rafId: number;
        const renderLoop = () => {
            draw();
            rafId = requestAnimationFrame(renderLoop);
        };
        renderLoop();
        return () => cancelAnimationFrame(rafId);
    }, [draw]);

    return (
        <motion.div
            className="relative"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
        >
            <motion.canvas
                ref={canvasRef}
                width={size}
                height={size}
                className="border-4 border-cyan-500/50 shadow-2xl rounded-xl bg-black/90"
                animate={{
                    boxShadow: [
                        '0 0 20px rgba(6, 182, 212, 0.5)',
                        '0 0 40px rgba(6, 182, 212, 0.3)',
                        '0 0 20px rgba(6, 182, 212, 0.5)'
                    ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
            />

            <motion.div
                className="absolute bottom-4 left-4 text-xs bg-black/80 backdrop-blur-sm border border-cyan-500/50 p-3 rounded-lg text-cyan-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div>Turn: {turn}</div>
                <div>Energy: {robots[0]?.energy || 0}/10</div>
                <div>Node Turns: {robots[0]?.consecutiveDataNodeTurns || 0}/3</div>
                <div className="text-xs mt-1 opacity-75">
                    WASD/Arrows: Move | Enter: Next Turn | R: Reset
                </div>
            </motion.div>
        </motion.div>
    );
}
