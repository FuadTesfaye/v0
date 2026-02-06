'use client';
import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

export default function GameplayScreen() {
    const {
        timer,
        maxTimer,
        score,
        combo,
        currentSnippet,
        submitFix,
        updateTimer,
        difficulty
    } = useGameStore();

    const [feedback, setFeedback] = useState<'success' | 'failure' | null>(null);

    // Timer Tick
    useEffect(() => {
        const interval = setInterval(() => {
            updateTimer(100);
        }, 100);
        return () => clearInterval(interval);
    }, [updateTimer]);

    const handleKeyPress = useCallback((e: KeyboardEvent) => {
        if (!currentSnippet || feedback) return;

        // Simplified logic: Player must press the correct character at the error point
        // For Phase 1: We'll check if the key matches the solution character at the error index
        const errorIndex = currentSnippet.errorIndices[0];
        const correctChar = currentSnippet.solution[errorIndex];

        if (e.key === correctChar) {
            setFeedback('success');
            setTimeout(() => {
                submitFix(true);
                setFeedback(null);
            }, 200);
        } else if (e.key.length === 1) { // Any other single character
            setFeedback('failure');
            setTimeout(() => {
                submitFix(false);
                setFeedback(null);
            }, 400);
        }
    }, [currentSnippet, submitFix, feedback]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handleKeyPress]);

    const timePercent = (timer / maxTimer) * 100;
    const isUrgent = timePercent < 20;
    const isCritical = timePercent < 5;

    return (
        <div className={`fixed inset-0 flex flex-col items-center justify-center transition-colors duration-500 ${isCritical ? 'bg-red-950/20' : 'bg-transparent'}`}>
            {/* HUD Header */}
            <div className="w-full max-w-4xl flex justify-between items-end px-6 mb-12">
                <div className="flex flex-col">
                    <span className="text-[10px] font-mono text-white/30 tracking-widest">CURRENT_ACCURACY</span>
                    <span className="text-2xl font-black text-white">{score}</span>
                </div>

                <div className="flex flex-col items-center gap-2">
                    <motion.span
                        className={`text-6xl font-black tabular-nums tracking-tighter ${isUrgent ? 'text-red-500 scale-110' : 'text-white'}`}
                        animate={isUrgent ? { scale: [1, 1.05, 1] } : {}}
                        transition={{ duration: 0.2, repeat: Infinity }}
                    >
                        {(timer / 1000).toFixed(2)}
                    </motion.span>
                    <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className={`h-full ${isUrgent ? 'bg-red-500' : 'bg-cyan-400'}`}
                            initial={{ width: '100%' }}
                            animate={{ width: `${timePercent}%` }}
                            transition={{ duration: 0.1 }}
                        />
                    </div>
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-mono text-white/30 tracking-widest">COMBO_MULT</span>
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={combo}
                            initial={{ scale: 1.5, color: '#fff' }}
                            animate={{ scale: 1, color: combo > 5 ? '#a855f7' : '#fff' }}
                            className="text-4xl font-black"
                        >
                            x{combo}
                        </motion.span>
                    </AnimatePresence>
                </div>
            </div>

            {/* Code Panel */}
            <motion.div
                className={`w-full max-w-2xl bg-black/80 border-2 rounded-xl p-8 font-mono text-xl relative ${feedback === 'success' ? 'border-cyan-400' :
                        feedback === 'failure' ? 'border-red-500' :
                            'border-white/10'
                    }`}
                animate={feedback === 'failure' ? { x: [-5, 5, -5, 5, 0] } : {}}
            >
                <div className="absolute top-2 left-4 text-[10px] text-white/20 uppercase tracking-widest">
                    Snippet_Processor_v4 // {currentSnippet?.language}
                </div>

                <div className="mt-4 leading-relaxed whitespace-pre font-mono crisp">
                    {currentSnippet?.code.split('').map((char, i) => {
                        const isError = currentSnippet.errorIndices.includes(i);
                        return (
                            <span
                                key={i}
                                className={`${isError
                                        ? 'text-cyan-400 bg-cyan-400/20 px-0.5 animate-pulse border-b-2 border-cyan-400'
                                        : 'text-white/80'
                                    } ${feedback === 'failure' && isError ? 'text-red-500 bg-red-500/20 border-red-500' : ''}`}
                            >
                                {char}
                            </span>
                        );
                    })}
                </div>

                {/* Action Indicator */}
                <div className="mt-12 flex justify-between items-center opacity-30 text-[10px] uppercase tracking-tighter">
                    <span>{difficulty} // DEPOT_SYNC_ACTIVE</span>
                    <span>FIX_SYSTEM_ERROR</span>
                </div>
            </motion.div>

            {/* Extreme Pressure Vignette */}
            <AnimatePresence>
                {isCritical && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(239,68,68,0.4)] z-50 animate-pulse"
                    />
                )}
            </AnimatePresence>

            {/* Feedback Flashes */}
            <AnimatePresence>
                {feedback === 'success' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-cyan-400 pointer-events-none z-40"
                    />
                )}
                {feedback === 'failure' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.15 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-red-600 pointer-events-none z-40"
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
