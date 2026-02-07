'use client';
import { useEffect, useRef, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { MiniBot } from './ui/mini-bot';

export default function GridCanvas() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const { board, units, activeUnitId, turn } = useGameStore();
    const { width, height, tiles } = board;

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

        // Background - Transparent so CSS background shows through
        ctx.clearRect(0, 0, dimensions.width, dimensions.height);

        // Save context for translation
        ctx.save();
        ctx.translate(Math.floor(offsetX), Math.floor(offsetY));

        // Grid Lines - Subtle overlay
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
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




                // Tile Content
                if (tile.type === 'ENERGY_NODE') {
                    // Pulse Effect
                    const pulse = Math.sin(Date.now() / 200) * 5;
                    ctx.shadowColor = '#fbbf24'; // Amber
                    ctx.shadowBlur = 15 + pulse;
                    ctx.fillStyle = 'rgba(251, 191, 36, 0.2)';
                    ctx.beginPath();
                    ctx.arc(tx + tileSizePx / 2, ty + tileSizePx / 2, tileSizePx / 3, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.strokeStyle = '#fbbf24';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                } else if (tile.type === 'VIRUS_NODE') {
                    // Glitch Effect
                    ctx.fillStyle = 'rgba(168, 85, 247, 0.3)'; // Purple
                    ctx.fillRect(tx + 2, ty + 2, tileSizePx - 4, tileSizePx - 4);

                    ctx.strokeStyle = '#a855f7';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(tx, ty);
                    ctx.lineTo(tx + tileSizePx, ty + tileSizePx);
                    ctx.moveTo(tx + tileSizePx, ty);
                    ctx.lineTo(tx, ty + tileSizePx);
                    ctx.stroke();
                } else if (tile.type === 'TRAP_NODE') {
                    ctx.fillStyle = 'rgba(239, 68, 68, 0.3)'; // Red
                    ctx.fillRect(tx + 4, ty + 4, tileSizePx - 8, tileSizePx - 8);
                    ctx.strokeStyle = '#ef4444';
                    ctx.strokeRect(tx + 6, ty + 6, tileSizePx - 12, tileSizePx - 12);
                } else if (tile.type === 'WALL') {
                    ctx.fillStyle = '#334155'; // Slate 700
                    ctx.fillRect(tx, ty, tileSizePx, tileSizePx);
                    ctx.strokeStyle = '#475569';
                    ctx.strokeRect(tx, ty, tileSizePx, tileSizePx);
                }
                ctx.shadowBlur = 0;
            }
        }

        // Units are now rendered as DOM overlays (MiniBot)
        // Leaving this empty or removing the loop entirely

        // Restore context from translation
        ctx.restore();

    }, [tiles, width, height, dimensions]);

    useEffect(() => {
        let rafId: number;
        const renderLoop = () => {
            draw();
            rafId = requestAnimationFrame(renderLoop);
        };
        renderLoop();
        return () => cancelAnimationFrame(rafId);
    }, [draw]);


    const handleCanvasClick = (e: React.MouseEvent) => {
        if (!containerRef.current || useGameStore.getState().selectionMode === 'NONE') return;

        const rect = containerRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        const paddedWidth = dimensions.width - 20;
        const paddedHeight = dimensions.height - 20;
        const tileSizePx = Math.min(
            paddedWidth / Math.max(width, 1),
            paddedHeight / Math.max(height, 1)
        );
        const offsetX = (dimensions.width - (tileSizePx * width)) / 2;
        const offsetY = (dimensions.height - (tileSizePx * height)) / 2;

        const gridX = Math.floor((clickX - offsetX) / tileSizePx);
        const gridY = Math.floor((clickY - offsetY) / tileSizePx);

        if (gridX >= 0 && gridX < width && gridY >= 0 && gridY < height) {
            useGameStore.getState().placeVirusValues({ x: gridX, y: gridY });
        }
    };

    return (
        <motion.div
            ref={containerRef}
            onClick={handleCanvasClick}
            className={`w-full h-full relative border-4 border-cyan-500/50 shadow-2xl rounded-xl overflow-hidden bg-black ${useGameStore.getState().selectionMode === 'PLACE_VIRUS' ? 'cursor-crosshair ring-2 ring-purple-500' : ''}`}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
        >
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: "url('/assets/board.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    opacity: 0.2
                }}
            />
            <canvas
                ref={canvasRef}
                width={dimensions.width}
                height={dimensions.height}
                className="block relative z-10"
            />

            {/* Units Overlay */}
            {dimensions.width > 0 && units.map((unit) => {
                const paddedWidth = dimensions.width - 20;
                const paddedHeight = dimensions.height - 20;
                const tileSizePx = Math.min(
                    paddedWidth / Math.max(width, 1),
                    paddedHeight / Math.max(height, 1)
                );
                const offsetX = (dimensions.width - (tileSizePx * width)) / 2;
                const offsetY = (dimensions.height - (tileSizePx * height)) / 2;

                const left = offsetX + unit.position.x * tileSizePx;
                const top = offsetY + unit.position.y * tileSizePx;

                return (
                    <motion.div
                        key={unit.id}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1, left, top }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="absolute pointer-events-none"
                        style={{
                            width: tileSizePx,
                            height: tileSizePx
                        }}
                    >
                        <div className="w-full h-full flex items-center justify-center relative">
                            {/* Selection Ring */}
                            {activeUnitId === unit.id && (
                                <motion.div
                                    className="absolute inset-0 rounded-full border-2 border-white/50 shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                                    layoutId="selection-ring"
                                />
                            )}
                            <MiniBot
                                color={unit.owner === 'PLAYER' ? '#06b6d4' : '#ef4444'}
                                className="w-[80%] h-[80%]"
                                isMoving={activeUnitId === unit.id} // Simple animation trigger
                            />
                        </div>
                    </motion.div>
                );
            })}

            <div className="absolute top-4 right-4 z-20 pointer-events-none text-right font-mono text-cyan-500 text-xs">
                <div>Turn: {turn}</div>
            </div>

            <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
                <div className="text-xs text-cyan-500/75 font-mono bg-black/50 inline-block px-3 py-1 rounded">
                    Select units to write code. Press &apos;RUN CODE&apos; to execute.
                </div>
            </div>
        </motion.div>
    );
}
