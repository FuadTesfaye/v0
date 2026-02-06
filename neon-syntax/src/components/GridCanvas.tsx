'use client';
import { useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { Tile, Unit } from '@/types/grid';

interface GridCanvasProps {
    size?: number;
}

export default function GridCanvas({ size = 500 }: GridCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { grid, selectUnit, activeUnitId } = useGameStore();
    const { tiles, units, turn, width, height } = grid;

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const tileSizePx = size / Math.max(width, height);
        const time = Date.now();

        // Background
        ctx.fillStyle = '#020205';
        ctx.fillRect(0, 0, size, size);

        // Grid Lines
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= width; i++) {
            ctx.beginPath();
            ctx.moveTo(i * tileSizePx, 0);
            ctx.lineTo(i * tileSizePx, size);
            ctx.stroke();
        }
        for (let j = 0; j <= height; j++) {
            ctx.beginPath();
            ctx.moveTo(0, j * tileSizePx);
            ctx.lineTo(size, j * tileSizePx);
            ctx.stroke();
        }

        // Tiles
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const tile = tiles[x]?.[y];
                if (!tile) continue;

                const tx = x * tileSizePx;
                const ty = y * tileSizePx;

                if (!tile.revealed) {
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                    ctx.fillRect(tx, ty, tileSizePx, tileSizePx);
                    continue;
                }

                // Tile Content
                if (tile.type === 'DATA_NODE') {
                    ctx.shadowColor = '#00ff88';
                    ctx.shadowBlur = 15;
                    ctx.fillStyle = 'rgba(0, 255, 136, 0.2)';
                    ctx.fillRect(tx + 4, ty + 4, tileSizePx - 8, tileSizePx - 8);
                    ctx.strokeStyle = '#00ff88';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(tx + 8, ty + 8, tileSizePx - 16, tileSizePx - 16);
                } else if (tile.type === 'ENERGY') {
                    ctx.fillStyle = 'rgba(255, 255, 0, 0.1)';
                    ctx.beginPath();
                    ctx.arc(tx + tileSizePx / 2, ty + tileSizePx / 2, tileSizePx / 4, 0, Math.PI * 2);
                    ctx.fill();
                } else if (tile.type === 'TRAP') {
                    ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
                    ctx.fillRect(tx + tileSizePx / 4, ty + tileSizePx / 4, tileSizePx / 2, tileSizePx / 2);
                }
                ctx.shadowBlur = 0;
            }
        }

        // Units
        units.forEach((unit) => {
            const tx = unit.position.x * tileSizePx;
            const ty = unit.position.y * tileSizePx;
            const cx = tx + tileSizePx / 2;
            const cy = ty + tileSizePx / 2;

            if (!tiles[unit.position.x][unit.position.y].revealed && unit.owner === 'ENEMY') return;

            ctx.save();
            ctx.translate(cx, cy);

            // unit body
            const color = unit.owner === 'PLAYER' ? '#06b6d4' : '#ef4444';
            ctx.shadowColor = color;
            ctx.shadowBlur = 10;
            ctx.fillStyle = color;

            if (unit.type === 'SCOUT') {
                ctx.beginPath();
                ctx.moveTo(0, -tileSizePx / 4);
                ctx.lineTo(tileSizePx / 4, tileSizePx / 4);
                ctx.lineTo(-tileSizePx / 4, tileSizePx / 4);
                ctx.closePath();
            } else {
                ctx.fillRect(-tileSizePx / 4, -tileSizePx / 4, tileSizePx / 2, tileSizePx / 2);
            }
            ctx.fill();

            // Active indicator
            if (unit.id === activeUnitId) {
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 2;
                ctx.strokeRect(-tileSizePx / 2 + 2, -tileSizePx / 2 + 2, tileSizePx - 4, tileSizePx - 4);
            }

            ctx.restore();
        });
    }, [tiles, units, width, height, size, activeUnitId]);

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

            <div>Turn: {turn}</div>
            <div>Energy: {units[0]?.energy || 0}/10</div>
            <div className="text-xs mt-1 opacity-75">
                Select units to write code. Press 'RUN CODE' to execute.
            </div>
        </motion.div>
    );
}
