'use client';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

export default function ResultsScreen() {
    const { score, accuracy, maxCombo, lastRunSuccess, setStage, resetGame } = useGameStore();

    const getRank = () => {
        if (accuracy > 95) return { label: 'S', color: 'text-cyan-400' };
        if (accuracy > 85) return { label: 'A', color: 'text-purple-400' };
        if (accuracy > 70) return { label: 'B', color: 'text-green-400' };
        return { label: 'C', color: 'text-white/50' };
    };

    const rank = getRank();

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#020205] z-[100] px-6">
            <div className="w-full max-w-lg">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center mb-12"
                >
                    <motion.div
                        className={`text-[120px] font-black leading-none ${rank.color}`}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5, type: 'spring' }}
                    >
                        {rank.label}
                    </motion.div>
                    <div className="text-[10px] font-mono text-white/30 tracking-[0.6em] -mt-4">RANK_CLASSIFICATION</div>
                </motion.div>

                <div className="grid grid-cols-2 gap-8 mb-16 font-mono">
                    <Stat label="FINAL_SCORE" value={score} delay={0.8} />
                    <Stat label="ACCURACY" value={`${accuracy.toFixed(1)}%`} delay={1.0} />
                    <Stat label="MAX_COMBO" value={maxCombo} delay={1.2} />
                    <Stat label="SURVIVAL_STATUS" value={lastRunSuccess ? 'STABLE' : 'CRITICAL'} delay={1.4} />
                </div>

                <div className="flex flex-col gap-4">
                    <motion.button
                        onClick={() => {
                            setStage('MENU');
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.8 }}
                        className="w-full py-4 border-2 border-cyan-500 text-cyan-400 font-bold tracking-[0.4em] hover:bg-cyan-500 hover:text-black transition-all duration-300"
                    >
                        INITIATE_RETRY
                    </motion.button>

                    <motion.button
                        onClick={() => setStage('MENU')}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.0 }}
                        className="w-full py-2 text-[10px] font-mono text-white/20 tracking-widest hover:text-white/50"
                    >
                        RETURN_TO_TERMINAL
                    </motion.button>
                </div>
            </div>
        </div>
    );
}

function Stat({ label, value, delay }: { label: string, value: string | number, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay }}
            className="flex flex-col border-l border-white/10 pl-4"
        >
            <span className="text-[10px] text-white/30 mb-1">{label}</span>
            <span className="text-2xl font-black text-white">{value}</span>
        </motion.div>
    );
}
