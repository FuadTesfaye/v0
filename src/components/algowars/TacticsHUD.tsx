
import React from 'react';
import { RankedPlayerState, ProblemCluster, Tactic } from '../../algowars/types/ranked';

interface TacticsHUDProps {
    playerState: RankedPlayerState;
}

export function TacticsHUD({ playerState }: TacticsHUDProps) {
    const clusters = [
        ProblemCluster.AGGRESSION,
        ProblemCluster.CONTROL,
        ProblemCluster.DECEPTION,
        ProblemCluster.ENDGAME,
    ];

    return (
        <div className="p-4 bg-black/80 border border-cyan-500/30 rounded-lg text-cyan-100 font-mono">
            <h3 className="text-lg font-bold mb-2 text-cyan-400">TACTICAL SYSTEMS</h3>

            {/* Score */}
            <div className="mb-4">
                <span className="text-sm text-gray-400">SCORE:</span>
                <span className="text-xl ml-2 text-yellow-400">{playerState.score}</span>
            </div>

            {/* Active Tactics */}
            <div className="mb-4">
                <h4 className="text-xs uppercase text-gray-500 mb-1">Active Modules</h4>
                <div className="space-y-2">
                    {playerState.activeTactics.length === 0 && (
                        <div className="text-xs text-gray-600 italic">No active tactics</div>
                    )}
                    {playerState.activeTactics.map((tactic) => (
                        <div key={tactic.id} className="bg-cyan-900/40 p-2 rounded border-l-2 border-cyan-400 animate-pulse">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-sm text-cyan-300">{tactic.name}</span>
                                <span className="text-xs text-cyan-500">{tactic.duration}s</span>
                            </div>
                            <p className="text-xs text-gray-300">{tactic.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cluster Influence */}
            <div>
                <h4 className="text-xs uppercase text-gray-500 mb-1">Cluster Influence</h4>
                <div className="grid grid-cols-2 gap-2">
                    {clusters.map((cluster) => {
                        const val = playerState.clusterInfluence[cluster] || 0;
                        const max = 5; // Visual max
                        const pct = Math.min((val / max) * 100, 100);

                        return (
                            <div key={cluster} className="bg-gray-900 p-2 rounded">
                                <div className="text-xs mb-1 flex justify-between">
                                    <span>{cluster}</span>
                                    <span>{val}</span>
                                </div>
                                <div className="h-1 bg-gray-700 rounded overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-500 ${getClusterColor(cluster)}`}
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function getClusterColor(c: ProblemCluster) {
    switch (c) {
        case ProblemCluster.AGGRESSION: return 'bg-red-500';
        case ProblemCluster.CONTROL: return 'bg-blue-500';
        case ProblemCluster.DECEPTION: return 'bg-purple-500';
        case ProblemCluster.ENDGAME: return 'bg-green-500';
        default: return 'bg-white';
    }
}
