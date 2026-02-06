'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import BootSequence from '@/components/BootSequence';
import MainMenu from '@/components/MainMenu';
import ResultsScreen from '@/components/ResultsScreen';
import Dashboard from '@/components/Dashboard';
import { useEffect } from 'react';

export default function GamePage() {
    const { stage, setStage } = useGameStore();

    useEffect(() => {
        // Ensure we start fresh or in BOOT if coming from Landing
        if (stage === 'LANDING') {
            setStage('BOOT');
        }
    }, [stage, setStage]);

    return (
        <main className="min-h-screen w-full relative overflow-hidden bg-[#020205] text-white">
            {/* Game Stages */}
            <AnimatePresence mode="wait">
                {stage === 'BOOT' && (
                    <BootSequence key="boot" />
                )}

                {stage === 'MENU' && (
                    <MainMenu key="menu" />
                )}

                {(stage === 'PLAYING' || stage === 'PAUSED') && (
                    <Dashboard key="dashboard" />
                )}

                {stage === 'RESULTS' && (
                    <ResultsScreen key="results" />
                )}
            </AnimatePresence>

            {/* Dynamic Background */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute inset-0 bg-[#020205]" />

                {/* Animated Parallax Grid */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.5)_50%),linear-gradient(90deg,rgba(0,170,255,0.05),rgba(0,170,255,0.01),rgba(0,170,255,0.05))] bg-[length:100%_4px,4px_100%]" />
                </div>

                {/* Ambient Glows */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/5 blur-[120px] rounded-full animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full animate-pulse" />
                </div>
            </div>

            {/* Global Vignette */}
            <div className="fixed inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] z-[200]" />
        </main>
    );
}
