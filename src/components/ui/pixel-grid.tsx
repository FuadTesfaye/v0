"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { MiniBot } from "./mini-bot";

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

type Agent = {
    id: string;
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    speed: number;
    color: string;
    type: 'USER' | 'NPC';
};

export const RobotPixelGrid: React.FC<RobotPixelGridProps> = ({
    gridCols = 40,
    gridRows = 25,
    className,
    baseColor = "#1a1a2e",
    robotColor = "#00ff88",
    highlightColor = "#00aaff",
}) => {
    // We use a separated Logic Component pattern to keep the animation loop performant 
    // and avoid React re-renders on every frame while maintaining state.
    // However, for simplicity here, we'll implement it directly with refs for mutable state.

    return (
        <MultiAgentGridLogic
            gridCols={gridCols}
            gridRows={gridRows}
            baseColor={baseColor}
            className={className}
        />
    );
};

const MultiAgentGridLogic = ({ gridCols, gridRows, baseColor, className }: any) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const domAgentsRef = useRef<HTMLDivElement>(null);

    // Mutable animation state
    const agentsRef = useRef<Agent[]>([]);
    const mousePos = useRef({ x: 0.5, y: 0.5 });
    const pixelsRef = useRef<Pixel[]>([]);
    const animationRef = useRef<number>(0);

    // Initial Setup
    useEffect(() => {
        // Init Agents
        const initialAgents: Agent[] = [
            { id: 'player', x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5, speed: 0.08, color: '#00ff88', type: 'USER' }
        ];
        // Create 7 Autonomous NPCs
        for (let i = 0; i < 7; i++) {
            initialAgents.push({
                id: `npc-${i}`,
                x: Math.random(),
                y: Math.random(),
                targetX: Math.random(),
                targetY: Math.random(),
                speed: 0.002 + Math.random() * 0.004, // Slower NPCs
                color: i % 2 === 0 ? "#ff0088" : "#00ccff",
                type: 'NPC'
            });
        }
        agentsRef.current = initialAgents;

        // Init Pixels
        const pixels: Pixel[] = [];
        for (let r = 0; r < gridRows; r++) {
            for (let c = 0; c < gridCols; c++) {
                pixels.push({ x: c, y: r, color: baseColor, elevation: 0, targetElevation: 0 });
            }
        }
        pixelsRef.current = pixels;

        // Mouse Handler
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            mousePos.current = {
                x: Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)),
                y: Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))
            };
        };
        window.addEventListener("mousemove", handleMouseMove);

        // Animation Loop
        const loop = () => {
            update(gridCols, gridRows);
            draw(gridCols, gridRows);
            updateDOM();
            animationRef.current = requestAnimationFrame(loop);
        };
        loop();

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(animationRef.current);
        };
    }, [gridCols, gridRows, baseColor]);

    // Update Logic
    const update = (cols: number, rows: number) => {
        // Update Agents
        agentsRef.current.forEach(agent => {
            let tx = agent.targetX;
            let ty = agent.targetY;

            if (agent.type === 'USER') {
                tx = mousePos.current.x;
                ty = mousePos.current.y;
            } else {
                // AI Logic
                const dist = Math.sqrt((agent.x - tx) ** 2 + (agent.y - ty) ** 2);
                if (dist < 0.05 || Math.random() < 0.002) {
                    agent.targetX = Math.random();
                    agent.targetY = Math.random();
                }
            }

            // Move
            agent.x += (tx - agent.x) * agent.speed;
            agent.y += (ty - agent.y) * agent.speed;
        });

        // Update Pixels
        pixelsRef.current.forEach(pixel => {
            let maxInf = 0;
            let targetColor = { r: 26, g: 26, b: 46 };

            // Check against all agents
            for (let agent of agentsRef.current) {
                const ax = agent.x * cols;
                const ay = agent.y * rows;
                const d = Math.sqrt((pixel.x - ax) ** 2 + (pixel.y - ay) ** 2);
                const inf = Math.max(0, 1 - d / 6);

                if (inf > maxInf) {
                    maxInf = inf;
                    // Parse hex to RGB roughly
                    if (agent.color === "#00ff88") targetColor = { r: 0, g: 255, b: 136 };
                    else if (agent.color === "#ff0088") targetColor = { r: 255, g: 0, b: 136 };
                    else targetColor = { r: 0, g: 204, b: 255 };
                }
            }

            pixel.targetElevation = maxInf * 1.5;
            pixel.elevation += (pixel.targetElevation - pixel.elevation) * 0.1;

            // Dynamic color mixing
            const r = 26 + (targetColor.r - 26) * Math.min(1, pixel.elevation);
            const g = 26 + (targetColor.g - 26) * Math.min(1, pixel.elevation);
            const b = 46 + (targetColor.b - 46) * Math.min(1, pixel.elevation);

            pixel.color = `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
        });
    };

    // Draw Logic
    const draw = (cols: number, rows: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const cellW = canvas.width / cols;
        const cellH = canvas.height / rows;

        pixelsRef.current.forEach(p => {
            ctx.fillStyle = p.color;
            const shift = p.elevation * -10;
            ctx.fillRect(p.x * cellW + 1, p.y * cellH + 1 + shift, cellW - 2, cellH - 2);
        });
    };

    // Update DOM Agents positions manually for performance
    const updateDOM = () => {
        if (domAgentsRef.current) {
            const children = domAgentsRef.current.children;
            agentsRef.current.forEach((agent, i) => {
                if (children[i]) {
                    const el = children[i] as HTMLElement;
                    el.style.left = `${agent.x * 100}%`;
                    el.style.top = `${agent.y * 100}%`;
                }
            });
        }
    };

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


    return (
        <div ref={containerRef} className={cn("relative w-full h-full bg-[#020205]", className)}>
            <canvas ref={canvasRef} className="block w-full h-full" />

            {/* Agents Overlay */}
            <div ref={domAgentsRef} className="absolute inset-0 pointer-events-none">
                {/* 8 Agents by default */}
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                        style={{ width: '40px', height: '40px' }}
                    >
                        <MiniBot
                            color={i === 0 ? '#00ff88' : (i % 2 === 0 ? '#ff0088' : '#00ccff')}
                            isMoving={true}
                        />

                        {/* Player Ring Indicator */}
                        {i === 0 && (
                            <div className="absolute -inset-4 border border-[#00ff88]/30 rounded-full animate-[spin_4s_linear_infinite] border-t-transparent border-l-transparent pointer-events-none" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
