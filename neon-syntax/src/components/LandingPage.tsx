"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { RobotPixelGrid } from './ui/pixel-grid';
import { Navbar } from './Navbar';
import { useRouter } from 'next/navigation';
import Faq2 from '@/components/mvpblocks/faq-2';
import AboutUs from '@/components/mvpblocks/about-us';
import FeaturesSection from '@/components/mvpblocks/features-section';

export default function LandingPage() {
    const router = useRouter();

    const handleStart = () => {
        router.push('/algowars');
    };

    return (
        <div className="relative w-full min-h-screen overflow-x-hidden bg-black font-mono">
            {/* Background Grid Simulation - Custom Fixed Position */}
            <div className="fixed inset-0 z-0 opacity-60">
                <RobotPixelGrid
                    gridCols={40}
                    gridRows={25}
                    baseColor="#050510"
                    highlightColor="#00ccff"
                    robotColor="#00ff99"
                />
            </div>

            {/* Navigation */}
            <Navbar />

            {/* Hero Section */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full pointer-events-none">

                {/* Title Block */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center space-y-4"
                >
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-500 [text-shadow:0_0_20px_rgba(0,170,255,0.2)]">
                        NEON SYNTAX
                    </h1>
                    <p className="text-cyan-400/80 text-sm md:text-lg tracking-[0.2em] uppercase">
                        Neural Interface • Tactical Protocol
                    </p>
                </motion.div>

                {/* Start Button */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="mt-16 pointer-events-auto"
                >
                    <button
                        onClick={handleStart}
                        className="group relative px-8 py-4 bg-cyan-950/30 border border-cyan-500/50 hover:bg-cyan-500/10 hover:border-cyan-400 transition-all duration-300 overflow-hidden"
                    >
                        {/* Button Scanline Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />

                        <span className="relative flex items-center gap-3 text-cyan-300 group-hover:text-cyan-100 font-bold tracking-widest text-lg">
                            <span>INITIALIZE_LINK</span>
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </span>

                        {/* Corner Accents */}
                        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-500" />
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-500" />
                    </button>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, y: [0, 10, 0] }}
                    transition={{ delay: 1, duration: 2, repeat: Infinity }}
                    className="absolute bottom-12 left-0 right-0 text-center pointer-events-auto"
                >
                    <p className="text-[10px] text-cyan-500/50 mb-2 tracking-widest">SCROLL FOR INFO</p>
                    <svg className="w-6 h-6 text-cyan-500/50 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </motion.div>
            </div>

            {/* About Us Section */}
            <AboutUs />

            {/* Features Section */}
            <FeaturesSection />

            {/* FAQ Section */}
            <div className="relative z-10 bg-gradient-to-b from-transparent via-black/80 to-black">
                <Faq2 />
            </div>

            {/* Footer */}
            <div className="relative z-10 py-8 text-center border-t border-white/5 bg-black">
                <p className="text-xs text-white/20">
                    SYSTEM STATUS: <span className="text-green-500 animate-pulse">ONLINE</span> • V0.1.0
                </p>
            </div>
        </div>
    );
}
