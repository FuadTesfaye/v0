'use client';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { Terminal, Code2, Braces, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LanguageSelector() {
    const { setLanguage, setStage, addLog } = useGameStore();

    const handleSelect = (lang: 'python' | 'javascript') => {
        setLanguage(lang);
        setStage('BOOT');
        addLog(`LANGUAGE_SELECTED: ${lang.toUpperCase()}`, 'command');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#020205] text-white p-8 relative z-50">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/5 blur-[150px] rounded-full" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/5 blur-[150px] rounded-full" />
            </div>

            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16 relative z-10"
            >
                <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-white to-purple-400">
                    SELECT PROTOCOL
                </h1>
                <p className="text-cyan-500/60 font-mono text-sm md:text-base tracking-[0.2em] uppercase max-w-2xl mx-auto">
                    Choose your weapon. This choice defines your neural interface and progression path.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl relative z-10">
                {/* Python Card */}
                <LanguageCard
                    title="PYTHON"
                    icon={<Terminal className="w-12 h-12" />}
                    description="Clean logic. Algorithmic purity. Data efficiency."
                    features={[
                        "Algorithmic Problem Solving",
                        "Data Structures & Analysis",
                        "Readable, English-like Syntax",
                        "Computational Efficiency Focus"
                    ]}
                    color="text-yellow-400"
                    borderColor="group-hover:border-yellow-400/50"
                    bgGradient="from-yellow-400/5"
                    onClick={() => handleSelect('python')}
                />

                {/* JavaScript Card */}
                <LanguageCard
                    title="JAVASCRIPT"
                    icon={<Code2 className="w-12 h-12" />}
                    description="Event driven. Asynchronous state. Dynamic systems."
                    features={[
                        "Event-Driven Architecture",
                        "State Management Systems",
                        "Functional Programming Patterns",
                        "Asynchronous Execution"
                    ]}
                    color="text-cyan-400"
                    borderColor="group-hover:border-cyan-400/50"
                    bgGradient="from-cyan-400/5"
                    onClick={() => handleSelect('javascript')}
                />
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="mt-16 text-xs font-mono text-white/20 text-center max-w-md"
            >
                WARNING: Selection is permanent for this session. <br />
                Your interface will reconfigure to match the chosen syntax.
            </motion.div>
        </div>
    );
}

interface LanguageCardProps {
    title: string;
    icon: React.ReactNode;
    description: string;
    features: string[];
    color: string;
    borderColor: string;
    bgGradient: string;
    onClick: () => void;
}

function LanguageCard({ title, icon, description, features, color, borderColor, bgGradient, onClick }: LanguageCardProps) {
    return (
        <motion.button
            onClick={onClick}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "relative group flex flex-col h-full text-left p-8 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm overflow-hidden transition-all duration-300 w-full",
                borderColor
            )}
        >
            {/* Hover Gradient Background */}
            <div className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-transparent via-transparent to-transparent",
                // Construct the gradient class dynamically or pass full class
                `bg-gradient-to-br ${bgGradient} via-transparent to-transparent`
            )} />

            <div className="relative z-10 flex flex-col h-full">
                <div className={cn("mb-6 p-4 rounded-xl bg-white/5 w-fit", color)}>
                    {icon}
                </div>

                <h2 className={cn("text-3xl font-bold mb-2 tracking-wide", color)}>
                    {title}
                </h2>

                <p className="text-white/60 font-mono text-sm mb-8 border-b border-white/10 pb-6">
                    {description}
                </p>

                <div className="flex-1 space-y-3">
                    {features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm text-white/80 group/item">
                            <div className={cn("w-1.5 h-1.5 rounded-full transition-colors", color.replace('text-', 'bg-'))} />
                            <span className="group-hover/item:text-white transition-colors">{feature}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono uppercase tracking-widest text-white/40 group-hover:text-white/80 transition-colors">
                    <span>Initialize Path</span>
                    <span className="text-lg">→</span>
                </div>
            </div>
        </motion.button>
    );
}
