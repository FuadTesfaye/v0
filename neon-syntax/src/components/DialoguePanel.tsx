'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

export default function DialoguePanel() {
    const { currentDialogue } = useGameStore();

    return (
        <div className="h-48 bg-black/40 backdrop-blur-md border border-cyan-500/30 rounded-xl p-6 flex gap-6 relative overflow-hidden group">
            {/* Aesthetic scanlines */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

            {/* Speaker Avatar Placeholder */}
            <div className="w-32 h-32 flex-shrink-0 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-lg border border-cyan-500/50 relative overflow-hidden flex items-center justify-center">
                <div className="text-4xl">🤖</div>
                <motion.div
                    className="absolute inset-0 bg-cyan-500/10"
                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            </div>

            <div className="flex-1 flex flex-col pt-2">
                <AnimatePresence mode="wait">
                    {currentDialogue && (
                        <motion.div
                            key={currentDialogue.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex-1"
                        >
                            <div className="text-cyan-400 font-mono text-xs mb-2 tracking-widest uppercase flex items-center gap-2">
                                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                                {currentDialogue.speaker} {/* // Uplink Active */}
                            </div>
                            <p className="text-cyan-50/90 text-lg font-light leading-relaxed">
                                {currentDialogue.message}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="mt-auto flex justify-between items-center text-[10px] font-mono text-cyan-500/40 uppercase tracking-tighter">
                    <span>A.V.A Interface v1.0.4</span>
                    <motion.span animate={{ opacity: [0, 1] }} transition={{ repeat: Infinity }}>
                        _Waiting for input_
                    </motion.span>
                </div>
            </div>

            {/* Dynamic accent lines */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        </div>
    );
}
