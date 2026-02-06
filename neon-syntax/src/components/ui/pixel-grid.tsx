"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type RobotPixelGridProps = {
    gridCols?: number;
    gridRows?: number;
    className?: string;
    baseColor?: string;
    robotColor?: string;
    highlightColor?: string;
};

type Pixel = {
    x: number;
    y: number;
    color: string;
    elevation: number;
    targetElevation: number;
};

export const RobotPixelGrid: React.FC<RobotPixelGridProps> = ({
    gridCols = 40,
    gridRows = 25,
    className,
    baseColor = "#1a1a2e",
    robotColor = "#00ff88",
    highlightColor = "#00aaff",
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [robotPos, setRobotPos] = useState({ x: 0, y: 0 });
    const mousePos = useRef({ x: 0, y: 0 });
    const pixelsRef = useRef<Pixel[]>([]);
    const animationRef = useRef<number>(0);

    // Initialize pixels
    useEffect(() => {
        const pixels: Pixel[] = [];
        for (let r = 0; r < gridRows; r++) {
            for (let c = 0; c < gridCols; c++) {
                pixels.push({
                    x: c,
                    y: r,
                    color: baseColor,
                    elevation: 0,
                    targetElevation: 0,
                });
            }
        }
        pixelsRef.current = pixels;
    }, [gridCols, gridRows, baseColor]);

    // Track mouse
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            mousePos.current = {
                x: Math.max(0, Math.min(1, x)),
                y: Math.max(0, Math.min(1, y))
            };
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    // Animation Loop
    const render = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Update Robot Position (Smooth Follow)
        setRobotPos((prev) => {
            const lerp = 0.08;
            return {
                x: prev.x + (mousePos.current.x - prev.x) * lerp,
                y: prev.y + (mousePos.current.y - prev.y) * lerp,
            };
        });

        const width = canvas.width;
        const height = canvas.height;
        const cellW = width / gridCols;
        const cellH = height / gridRows;

        ctx.clearRect(0, 0, width, height);

        // Robot Grid Coordinates
        const robotGX = robotPos.x * gridCols;
        const robotGY = robotPos.y * gridRows;

        // Update and Draw Pixels
        pixelsRef.current.forEach((pixel) => {
            // Calculate distance to robot
            const dx = pixel.x - robotGX;
            const dy = pixel.y - robotGY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Effect radius and intensity
            const influence = Math.max(0, 1 - dist / 8); // Radius of 8 cells
            pixel.targetElevation = influence * 1.5; // Max height

            // Smooth elevation change
            pixel.elevation += (pixel.targetElevation - pixel.elevation) * 0.1;

            // Color blending
            // Base -> Highlight -> Robot
            let r = 26, g = 26, b = 46; // Base #1a1a2e

            if (pixel.elevation > 0.01) {
                // Highlight #00aaff (0, 170, 255)
                const mix = Math.min(1, pixel.elevation);
                r = r + (0 - r) * mix;
                g = g + (170 - g) * mix;
                b = b + (255 - b) * mix;

                // Robot Core #00ff88 (0, 255, 136) at very high elevation
                if (pixel.elevation > 0.8) {
                    const coreMix = (pixel.elevation - 0.8) * 5;
                    r = r + (0 - r) * coreMix;
                    g = g + (255 - g) * coreMix;
                    b = b + (136 - b) * coreMix;
                }
            }

            const size = 0.9; // Gap ratio
            const px = pixel.x * cellW;
            const py = pixel.y * cellH;

            // Draw Cell
            ctx.fillStyle = `rgb(${r},${g},${b})`;
            // simulate 3D shift based on elevation
            const shiftY = pixel.elevation * -10;

            ctx.fillRect(px + (cellW * (1 - size)) / 2, py + (cellH * (1 - size)) / 2 + shiftY, cellW * size, cellH * size);
        });

        // Draw Robot Overlay (Optional, a glowing orb on top)
        const rx = robotPos.x * width;
        const ry = robotPos.y * height;

        // Robot Glow
        const gradient = ctx.createRadialGradient(rx, ry, 0, rx, ry, 60);
        gradient.addColorStop(0, "rgba(0, 255, 136, 0.4)");
        gradient.addColorStop(1, "rgba(0, 255, 136, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        animationRef.current = requestAnimationFrame(render);
    }, [gridCols, gridRows, robotPos]);

    // Handle Resize
    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current && canvasRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                canvasRef.current.width = width;
                canvasRef.current.height = height;
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        animationRef.current = requestAnimationFrame(render);
        return () => cancelAnimationFrame(animationRef.current);
    }, [render]);

    return (
        <div ref={containerRef} className={cn("relative w-full h-full bg-[#020205]", className)}>
            <canvas ref={canvasRef} className="block w-full h-full" />

            {/* Robot Character (DOM Element for crispness) */}
            <div
                className="absolute pointer-events-none flex items-center justify-center"
                style={{
                    left: robotPos.x * 100 + '%',
                    top: robotPos.y * 100 + '%',
                    transform: 'translate(-50%, -50%)',
                    transition: 'left 0.1s linear, top 0.1s linear'
                }}
            >
                <div className="relative">
                    <div className="w-4 h-4 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_20px_rgba(34,211,238,0.8)]" />
                    <div className="absolute inset-0 border border-cyan-300 rounded-full w-8 h-8 -top-2 -left-2 animate-[spin_3s_linear_infinite] opacity-50 border-t-transparent border-l-transparent" />
                </div>
            </div>
        </div>
    );
};
