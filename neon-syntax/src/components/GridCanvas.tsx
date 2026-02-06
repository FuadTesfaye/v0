'use client';
import { useEffect, useRef, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

export default function GridCanvas() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const { grid, activeUnitId } = useGameStore();
    const { tiles, units, turn, width, height } = grid;

    // Handle resizing
    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                const { clientWidth, clientHeight } = containerRef.current;
                setDimensions({ width: clientWidth, height: clientHeight });
            }
        };

        updateSize();
        const observer = new ResizeObserver(updateSize);
        if (containerRef.current) observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, []);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || dimensions.width === 0 || dimensions.height === 0) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Calculate tile size to fit grid within available space while maintaining aspect ratio
        // We add a small padding (20px) to avoid edges touching
        const paddedWidth = dimensions.width - 20;
        const paddedHeight = dimensions.height - 20;

        const tileSizePx = Math.min(
            paddedWidth / Math.max(width, 1),
            paddedHeight / Math.max(height, 1)
        );

        // Center the grid
        const offsetX = (dimensions.width - (tileSizePx * width)) / 2;
        const offsetY = (dimensions.height - (tileSizePx * height)) / 2;

        // Background
        ctx.fillStyle = '#020205';
        ctx.fillRect(0, 0, dimensions.width, dimensions.height);

        // Save context for translation
        ctx.save();
        ctx.translate(Math.floor(offsetX), Math.floor(offsetY));

        // Grid Lines
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
        ctx.lineWidth = 1;

        // Draw Vertical Lines
        for (let i = 0; i <= width; i++) {
            ctx.beginPath();
            ctx.moveTo(i * tileSizePx, 0);
            ctx.lineTo(i * tileSizePx, height * tileSizePx);
            ctx.stroke();
        }

        // Draw Horizontal Lines
        for (let j = 0; j <= height; j++) {
            ctx.beginPath();
            ctx.moveTo(0, j * tileSizePx);
            ctx.lineTo(width * tileSizePx, j * tileSizePx);
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

        // Restore context from translation
        ctx.restore();

    }, [tiles, units, width, height, dimensions, activeUnitId]);

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
            ref={containerRef}
            className="w-full h-full relative border-4 border-cyan-500/50 shadow-2xl rounded-xl bg-black/90 overflow-hidden"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{
                scale: 1,
                opacity: 1,
                boxShadow: [
                    '0 0 20px rgba(6, 182, 212, 0.5)',
                    '0 0 40px rgba(6, 182, 212, 0.3)',
                    '0 0 20px rgba(6, 182, 212, 0.5)'
                ]
            }}
            transition={{
                duration: 0.8,
                ease: 'easeOut',
                boxShadow: { duration: 2, repeat: Infinity }
            }}
        >
            <canvas
                ref={canvasRef}
                width={dimensions.width}
                height={dimensions.height}
                className="block"
            />

            <div className="absolute top-4 right-4 pointer-events-none text-right font-mono text-cyan-500 text-xs">
                <div>Turn: {turn}</div>
                <div>Energy: {units[0]?.energy || 0}/10</div>
            </div>

            <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
                <div className="text-xs text-cyan-500/75 font-mono bg-black/50 inline-block px-3 py-1 rounded">
                    Select units to write code. Press &apos;RUN CODE&apos; to execute.
                </div>
            </div>
        </motion.div>
    );
}
