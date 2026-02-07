'use client';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

export default function MainMenu() {
    const { setStage, setDifficulty, difficulty } = useGameStore();

    const handleStart = () => {
        setStage('PLAYING');
        useGameStore.getState().startGame();
    };

    return (
        <div className="flex flex-col items-center justify-center gap-12 h-screen w-full relative z-10">
            <div className="text-center mb-8">
                <motion.h1
                    className="text-8xl font-black italic tracking-tighter text-white mb-2"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                >
                    ALGOWARS
                </motion.h1>
                <motion.p
                    className="text-cyan-400 font-mono tracking-[0.5em] text-xs opacity-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    REFLEX_CODE_REPAIR_UNIT
                </motion.p>
            </div>

            <div className="flex flex-col gap-6 w-64">
                <MenuButton label="START" onClick={handleStart} primary />

                <div className="flex flex-col gap-2 pt-4 border-t border-white/5">
                    <span className="text-[10px] font-mono text-white/30 text-center tracking-widest mb-1">DATA_LOAD_CONFIG</span>
                    <div className="flex gap-2">
                        <DifficultyButton
                            label="EASY"
                            active={difficulty === 'EASY'}
                            onClick={() => setDifficulty('EASY')}
                        />
                        <DifficultyButton
                            label="MED"
                            active={difficulty === 'MEDIUM'}
                            onClick={() => setDifficulty('MEDIUM')}
                        />
                        <DifficultyButton
                            label="HARD"
                            active={difficulty === 'HARD'}
                            onClick={() => setDifficulty('HARD')}
                        />
                    </div>
                </div>

                <MenuButton label="SETTINGS" onClick={() => { }} />
            </div>

            <div className="absolute bottom-12 text-[10px] font-mono text-white/20 tracking-tighter">
                V2.0.0 // SYSTEM_OS_ALGO
            </div>
        </div>
    );
}

function MenuButton({ label, onClick, primary = false }: { label: string, onClick: () => void, primary?: boolean }) {
    return (
        <motion.button
            onClick={onClick}
            className={`relative py-4 px-8 border-2 transition-all duration-300 group overflow-hidden ${primary
                ? 'border-cyan-500 text-cyan-400'
                : 'border-white/20 text-white/50 hover:border-white/40 hover:text-white/80'
                }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
        >
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${primary ? 'bg-cyan-400' : 'bg-white'}`} />
            <span className="relative z-10 font-bold tracking-[0.3em]">{label}</span>

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-inherit opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-inherit opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.button>
    );
}

function DifficultyButton({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`flex-1 py-2 text-[10px] font-bold border transition-all duration-300 tracking-widest ${active
                ? 'border-purple-500 text-purple-400 bg-purple-500/10'
                : 'border-white/10 text-white/30 hover:border-white/30'
                }`}
        >
            {label}
        </button>
    );
}
