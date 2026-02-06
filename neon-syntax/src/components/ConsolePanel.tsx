'use client';
import { useGameStore } from '@/store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConsolePanel() {
    const { logs } = useGameStore();

    return (
        <div className="h-48 bg-black/60 backdrop-blur-md border border-purple-500/30 rounded-xl p-4 font-mono text-xs overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-2 border-b border-purple-500/20 pb-1">
                <span className="text-purple-400 font-bold uppercase tracking-wider">System Terminal</span>
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500/50" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                    <div className="w-2 h-2 rounded-full bg-green-500/50" />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-purple-500/20">
                <AnimatePresence initial={false}>
                    {logs.map((log) => (
                        <motion.div
                            key={log.timestamp}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex gap-2"
                        >
                            <span className="text-purple-500/40">[{new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                            <span className={
                                log.type === 'error' ? 'text-red-400' :
                                    log.type === 'success' ? 'text-green-400' :
                                        log.type === 'command' ? 'text-cyan-400' :
                                            'text-purple-100/60'
                            }>
                                {log.type === 'command' ? '>> ' : ''}{log.message}
                            </span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="mt-2 text-[10px] text-purple-500/30 flex items-center gap-2">
                <span className="animate-pulse">●</span>
                <span>Connected: DroneCore_v3.42</span>
            </div>
        </div>
    );
}
