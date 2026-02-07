
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Crosshair, Trophy, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import ModeCard from '@/components/algowars/ModeCard';

export default function AlgoWarsLanding() {
    return (
        <main className="min-h-screen bg-[#020205] text-slate-200 relative overflow-hidden font-sans">

            {/* Dynamic Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#020205] to-[#020205]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.5)_50%),linear-gradient(90deg,rgba(0,170,255,0.03),rgba(0,170,255,0.01),rgba(0,170,255,0.03))] bg-[length:100%_4px,4px_100%] opacity-20" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-24">

                {/* Header */}
                <div className="mb-16">
                    <Link href="/" className="inline-flex items-center text-sm text-slate-500 hover:text-cyan-400 mb-8 transition-colors">
                        <ChevronLeft size={16} className="mr-1" /> RETURN_TO_ROOT
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-6 tracking-tight">
                            ALGOWARS
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-400 max-w-2xl">
                            Deploy logic. Control units. Eliminate inefficiencies. <br />
                            <span className="text-cyan-500/80 text-lg">Code is your weapon.</span>
                        </p>
                    </motion.div>
                </div>

                {/* Mode Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                    >
                        <ModeCard
                            title="TRAINING SIMULATION"
                            description="Calibrate your algorithms against standard bot protocols. Safe environment for debugging and optimization. No ranking penalties."
                            href="/algowars/training"
                            icon={<Terminal size={24} />}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <ModeCard
                            title="CAMPAIGN OPERATIONS"
                            description="Engage in a structured series of tactical challenges. Progress through zones, unlock new APIs, and face adaptive enemy logic."
                            href="/algowars/campaign"
                            icon={<Crosshair size={24} />}
                            comingSoon
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <ModeCard
                            title="RANKED WARFARE"
                            description="Upload your battle code to the global grid. Async PvP matches against other engineers. Climb the ELO ladder."
                            href="/algowars/ranked"
                            icon={<Trophy size={24} />}
                        />
                    </motion.div>

                </div>

                {/* Footer Stats / Fluff */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="mt-24 pt-8 border-t border-slate-900 grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left"
                >
                    <div>
                        <div className="text-2xl font-mono font-bold text-slate-200">2</div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider">Supported Runtimes</div>
                    </div>
                    <div>
                        <div className="text-2xl font-mono font-bold text-slate-200">10ms</div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider">Tick Rate</div>
                    </div>
                    <div>
                        <div className="text-2xl font-mono font-bold text-green-500">ONLINE</div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider">System Status</div>
                    </div>
                </motion.div>

            </div>
        </main>
    );
}
