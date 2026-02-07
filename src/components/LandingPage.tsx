"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { RobotPixelGrid } from './ui/pixel-grid';
import { Navbar } from './Navbar';
import { useRouter } from 'next/navigation';
import Faq2 from '@/components/mvpblocks/faq-2';
import HowItWorks from './mvpblocks/how-it-works';
import LoreSection from './mvpblocks/lore-section';
import AudienceSection from './mvpblocks/audience-section';
import AboutUs from '@/components/mvpblocks/about-us';
import FeaturesSection from '@/components/mvpblocks/features-section';
import { ChevronRight } from 'lucide-react';

export default function LandingPage() {
    const router = useRouter();

    const handleStart = () => {
        router.push('/algowars'); // Or wherever the beta signup/game starts
    };

    return (
        <div className="relative w-full min-h-screen overflow-x-hidden bg-black font-sans text-slate-300 selection:bg-cyan-500/30">
            {/* Background Grid Simulation - Custom Fixed Position */}
            <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
                <RobotPixelGrid
                    gridCols={40}
                    gridRows={25}
                    baseColor="#050508"
                    highlightColor="#00ccff"
                    robotColor="#00ff99"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
            </div>

            {/* Navigation */}
            <Navbar />

            {/* Hero Section */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full text-center px-4">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl mx-auto space-y-6"
                >
                    <div className="inline-block px-3 py-1 mb-4 rounded-full border border-cyan-500/30 bg-cyan-950/20 backdrop-blur-sm">
                        <span className="text-cyan-400 text-xs font-mono tracking-widest uppercase">
                            // SYSTEM_ONLINE: V0.1.0_BETA
                        </span>
                    </div>

                    <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-white drop-shadow-2xl">
                        ALGO<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">WARS</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        The world's first <span className="text-white font-bold">server-authoritative</span> tactical strategy game where
                        <span className="text-cyan-400 font-mono"> code();</span> is your only weapon.
                    </p>

                    {/* CTA Area */}
                    <div className="flex flex-col items-center gap-4 mt-12">
                        <button
                            onClick={handleStart}
                            className="group relative px-10 py-5 bg-white text-black font-black text-lg tracking-widest uppercase hover:bg-cyan-400 transition-colors clip-path-polygon"
                            style={{ clipPath: "polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)" }}
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                Initialize_Beta <ChevronRight className="w-5 h-5" />
                            </span>
                        </button>
                        <p className="text-xs text-gray-500 font-mono">
                            * Web-based beta. Progress may reset. Features evolving.
                        </p>
                    </div>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, y: [0, 10, 0] }}
                    transition={{ delay: 1, duration: 2, repeat: Infinity }}
                    className="absolute bottom-12 left-0 right-0 pointer-events-none"
                >
                    <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent mx-auto" />
                </motion.div>
            </div>

            {/* Content Sections */}
            <div className="relative z-10 bg-black">
                <HowItWorks />
                <FeaturesSection />
                <LoreSection />
                <AudienceSection />
                <AboutUs />

                {/* FAQ Section */}
                <div id="faq" className="py-24 border-t border-white/5 scroll-mt-24">
                    <div className="container mx-auto px-6 max-w-4xl">
                        <h2 className="text-3xl font-black text-center text-white mb-16 uppercase">System FAQ</h2>
                        <Faq2 />
                    </div>
                </div>

                {/* Footer */}
                <footer className="py-12 border-t border-white/10 bg-[#020202] text-center">
                    <div className="flex justify-center gap-8 mb-8 text-sm font-mono text-gray-500">
                        <a href="#" className="hover:text-cyan-400 transition-colors">GITHUB</a>
                        <a href="#" className="hover:text-cyan-400 transition-colors">DISCORD</a>
                        <a href="/docs" className="hover:text-cyan-400 transition-colors">DOCUMENTATION</a>
                    </div>
                    <p className="text-xs text-white/20 font-mono">
                        ALGOWARS // TACTICAL CODING PROTOCOL <br />
                        &copy; 2026. ALL RIGHTS RESERVED.
                    </p>
                </footer>
            </div>
        </div>
    );
}
