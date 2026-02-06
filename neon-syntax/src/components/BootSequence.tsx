'use client';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

export default function BootSequence() {
    const setStage = useGameStore(state => state.setStage);

    useEffect(() => {
        const timer = setTimeout(() => {
            setStage('MENU');
        }, 2800);
        return () => clearTimeout(timer);
    }, [setStage]);

    return (
        <motion.div
            className="fixed inset-0 bg-[#020205] flex items-center justify-center overflow-hidden cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setStage('MENU')}
        >
            {/* Faint Neon Grid */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.5)_50%),linear-gradient(90deg,rgba(0,255,136,0.1),rgba(0,255,136,0.01),rgba(0,255,136,0.1))] bg-[length:100%_4px,4px_100%]" />
                <motion.div
                    className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,136,0.2),transparent_70%)]"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                />
            </div>

            {/* Glitch Logo */}
            <motion.div
                className="relative z-10"
                initial={{ scale: 0.8, filter: 'blur(10px)' }}
                animate={{ scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <motion.h1
                    className="text-7xl font-black italic tracking-tighter text-white select-none"
                    animate={{
                        textShadow: [
                            '2px 0 #ff00ff, -2px 0 #00ffff',
                            '-2px 0 #ff00ff, 2px 0 #00ffff',
                            '0 0 #ff00ff, 0 0 #00ffff'
                        ],
                        x: [0, -2, 2, 0],
                    }}
                    transition={{ duration: 0.1, repeat: 5, repeatDelay: 0.5 }}
                >
                    NEON SYNTAX
                </motion.h1>

                {/* Rapid Character Flicker */}
                <motion.div
                    className="absolute -bottom-8 left-0 w-full text-center font-mono text-cyan-400 text-xs tracking-[1em] opacity-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.2, repeat: 10 }}
                >
                    INITIALIZING_CORE...
                </motion.div>
            </motion.div>

            {/* Scanning Line overlay */}
            <motion.div
                className="absolute top-0 left-0 w-full h-1 bg-cyan-400/20 shadow-[0_0_15px_rgba(6,182,212,0.5)] z-20"
                initial={{ top: '-10%' }}
                animate={{ top: '110%' }}
                transition={{ duration: 1.5, ease: 'linear', repeat: Infinity }}
            />
        </motion.div>
    );
}
