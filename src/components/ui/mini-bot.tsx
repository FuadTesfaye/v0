import React from 'react';
import { cn } from "@/lib/utils";

type MiniBotProps = {
    color?: string;
    className?: string;
    isMoving?: boolean;
};

export const MiniBot: React.FC<MiniBotProps> = ({
    color = "#00ff88",
    className,
    isMoving = true
}) => {
    // Generate a slightly darker version for treads/shadows
    const isCyan = color.includes("cyan") || color.includes("#06b6d4") || color.includes("#00ccff");
    const glowColor = isCyan ? "rgba(6,182,212,0.6)" : "rgba(0,255,136,0.6)";
    const bodyColor = isCyan ? "bg-cyan-500" : (color === "#ff0088" ? "bg-pink-500" : "bg-[#00ff88]");
    const eyeColor = "bg-yellow-200";

    return (
        <div className={cn("relative w-10 h-10", className)}>
            {/* Hover/Glow Effect */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full blur-xl opacity-40 animate-pulse"
                style={{ backgroundColor: color }}
            />

            {/* Bouncing Container */}
            <div className={cn("w-full h-full relative", isMoving && "animate-bounce-subtle")}>

                {/* Treads (L/R) */}
                <div className="absolute bottom-0 -left-1 w-3 h-4 bg-gray-800 rounded-sm border-l border-gray-600">
                    {/* Tread details */}
                    <div className="w-full h-[2px] bg-black/50 mt-1" />
                    <div className="w-full h-[2px] bg-black/50 mt-1" />
                </div>
                <div className="absolute bottom-0 -right-1 w-3 h-4 bg-gray-800 rounded-sm border-r border-gray-600">
                    <div className="w-full h-[2px] bg-black/50 mt-1" />
                    <div className="w-full h-[2px] bg-black/50 mt-1" />
                </div>

                {/* Body Chassis */}
                <div className={cn(
                    "absolute bottom-1 left-0 right-0 h-7 rounded-xl shadow-inner border-t border-white/20 overflow-hidden",
                    bodyColor,
                    "bg-gradient-to-br from-white/20 to-black/20"
                )}>
                    {/* Face Screen */}
                    <div className="absolute top-1.5 left-1.5 right-1.5 bottom-2 bg-black/90 rounded-lg flex items-center justify-center gap-1 shadow-[inset_0_0_5px_rgba(0,0,0,1)]">
                        {/* Eyes */}
                        <div className={cn("w-2 h-2 rounded-full shadow-[0_0_5px_currentColor]", eyeColor, "animate-blink")} />
                        <div className={cn("w-2 h-2 rounded-full shadow-[0_0_5px_currentColor]", eyeColor, "animate-blink")} />
                    </div>

                    {/* Antenna/Detail */}
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-2 bg-gray-400 rounded-t-full" />
                </div>
            </div>
        </div>
    );
};
