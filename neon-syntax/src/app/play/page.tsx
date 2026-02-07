
'use client';

import { useState } from 'react';
import GameCanvas from '../../components/game/GameCanvas';

export default function Play() {
    const [gameId, setGameId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const createGame = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/game', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ method: 'create_game' }),
            });
            const data = await res.json();
            if (data.gameId) {
                setGameId(data.gameId);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
            <h1 className="text-3xl font-bold mb-8 neon-text">NEON SYNTAX</h1>

            {!gameId ? (
                <button
                    onClick={createGame}
                    disabled={loading}
                    className="px-6 py-3 bg-green-600 hover:bg-green-500 rounded text-xl font-bold transition-all disabled:opacity-50"
                >
                    {loading ? 'Initializing...' : 'NEW GAME'}
                </button>
            ) : (
                <div className="w-full max-w-4xl h-[600px] border border-green-500/30 rounded-lg shadow-[0_0_20px_rgba(0,255,0,0.1)]">
                    <GameCanvas gameId={gameId} />
                    <div className="mt-4 text-center text-gray-400 text-sm">
                        Game ID: <span className="font-mono text-green-400">{gameId}</span>
                        <br />
                        (Lazy Simulation Active: State updates on polling)
                    </div>
                </div>
            )}
        </div>
    );
}
