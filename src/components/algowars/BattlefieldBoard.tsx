
import React from 'react';
import { motion } from 'framer-motion';
import { BattlefieldState, TileType, BattlefieldTile } from '../../algowars/types/ranked';

interface BattlefieldBoardProps {
    gameState: { battlefield: BattlefieldState };
}

export default function BattlefieldBoard({ gameState }: BattlefieldBoardProps) {
    if (!gameState.battlefield) return <div className="text-cyan-500 font-mono text-sm p-4">Initializing Matrix...</div>;

    const { width, height, grid, units } = gameState.battlefield;

    return (
        <div className="relative w-full aspect-video bg-black/80 rounded-lg border border-cyan-900/50 overflow-hidden shadow-inner shadow-black/50">
            {/* Grid Container */}
            <div
                className="absolute inset-0 grid"
                style={{
                    gridTemplateColumns: `repeat(${width}, 1fr)`,
                    gridTemplateRows: `repeat(${height}, 1fr)`,
                }}
            >
                {grid.map((row, y) =>
                    row.map((tile, x) => (
                        <Tile key={`${x}-${y}`} tile={tile} />
                    ))
                )}
            </div>

            {/* Units Layer */}
            <div className="absolute inset-0 pointer-events-none">
                {units.map((unit) => (
                    <Unit key={unit.id} unit={unit} gridWidth={width} gridHeight={height} />
                ))}
            </div>

            {/* Overlay Scanlines */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 pointer-events-none opacity-20 bg-[length:100%_4px,3px_100%]" />
        </div>
    );
}

function Tile({ tile }: { tile: BattlefieldTile }) {
    let bg = "bg-slate-900/50";
    let border = "border-slate-800/20";

    if (tile.type === TileType.PLAYER_BASE) {
        if (tile.x === 0) { // Naive P1 check
            bg = "bg-cyan-900/40";
            border = "border-cyan-500/50";
        } else {
            bg = "bg-red-900/40";
            border = "border-red-500/50";
        }
    } else if (tile.type === TileType.CENTRAL_NODE) {
        bg = "bg-yellow-500/10";
        border = "border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.2)]";
    }

    return (
        <div className={`w-full h-full border ${border} ${bg} relative group`}>
            {tile.type === TileType.CENTRAL_NODE && (
                <div className="absolute inset-2 bg-yellow-400 rounded-full animate-pulse opacity-50" />
            )}
        </div>
    );
}

function Unit({ unit, gridWidth, gridHeight }: { unit: any, gridWidth: number, gridHeight: number }) {
    // Convert grid coords to percentage
    const left = (unit.x / gridWidth) * 100;
    const top = (unit.y / gridHeight) * 100;
    const w = 100 / gridWidth;
    const h = 100 / gridHeight;

    const isPlayer = unit.ownerId === 'hero_player' || unit.ownerId === 'player_1';

    return (
        <motion.div
            className="absolute flex items-center justify-center p-1"
            initial={false}
            animate={{ left: `${left}%`, top: `${top}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            style={{ width: `${w}%`, height: `${h}%` }}
        >
            <div className={`
                w-full h-full rounded-sm shadow-lg flex items-center justify-center text-[10px] font-bold text-black
                ${isPlayer ? 'bg-cyan-400 shadow-cyan-500/40' : 'bg-red-500 shadow-red-500/40'}
            `}>
                {unit.type === 'tank' ? 'T' : unit.type === 'scout' ? 'S' : 'U'}
            </div>
        </motion.div>
    );
}
