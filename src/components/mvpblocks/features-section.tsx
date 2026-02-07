'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface FeatureItem {
    id: string;
    title: string;
    highlight: string;
    description: string[];
    icon: React.ReactNode;
}

const features: FeatureItem[] = [
    {
        id: '01',
        title: 'Play by',
        highlight: 'Scripting',
        description: [
            'Real programming, not just pseudocode. Use actual JavaScript concepts.',
            'Optimize your algorithms to outperform opponents in real-time.',
            'Access comprehensive API docs to build advanced combat logic.'
        ],
        icon: (
            <svg className="w-full h-full text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
        )
    },
    {
        id: '02',
        title: 'Programmable',
        highlight: 'World',
        description: [
            'A persistent universe that reacts to your code 24/7.',
            'Server-authoritative execution ensures fair play and anti-cheat.',
            'Your units continue to patrol and defend even while you are offline.'
        ],
        icon: (
            <svg className="w-full h-full text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    },
    {
        id: '03',
        title: 'Open Source',
        highlight: 'Sandbox',
        description: [
            'Contribute to the core engine and shape the future of the platform.',
            'Moddable architecture allowing for custom unit behaviors and skins.',
            'Earn in-game rewards for meaningful code contributions.'
        ],
        icon: (
            <svg className="w-full h-full text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
        )
    }
];

export default function FeaturesSection() {
    const containerRef = useRef<HTMLDivElement>(null);

    // We want the timeline to track the center of the viewport
    // So when the start of the section hits the center, we are at 0
    // When the end of the section hits the center, we are at 1
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const pathLength = useTransform(smoothProgress, [0, 1], [0, 1]);
    const trainY = useTransform(smoothProgress, [0, 1], ['0%', '100%']);

    return (
        <section id="features" ref={containerRef} className="relative py-24 z-20 overflow-hidden bg-black scroll-mt-24">

            <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
                <div className="mb-20 flex flex-col items-center">
                    <Badge
                        variant="outline"
                        className="border-purple-500/50 text-purple-400 mb-4 px-3 py-1 text-xs font-mono tracking-widest uppercase bg-purple-950/30"
                    >
                        SYSTEM_CAPABILITIES
                    </Badge>
                    <h2 className="text-4xl md:text-6xl font-black text-white text-center tracking-tighter">
                        CORE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">FEATURES</span>
                    </h2>
                </div>

                <div className="relative">
                    {/* Left Timeline Line */}
                    <div className="absolute left-0 md:left-8 top-0 bottom-0 w-px bg-cyan-900/30 h-full">
                        <motion.div
                            style={{ scaleY: pathLength, originY: 0 }}
                            className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-cyan-500 via-purple-500 to-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.8)]"
                        />

                        {/* The Robot Node "In Net" - Following the line */}
                        <motion.div
                            style={{ top: trainY }}
                            className="absolute left-1/2 -translate-x-1/2 z-10"
                        >
                            <div className="relative w-12 h-12 flex items-center justify-center">
                                {/* Rotating Net Rings */}
                                <div className="absolute inset-0 border border-cyan-500/50 rounded-full animate-[spin_4s_linear_infinite]" />
                                <div className="absolute inset-1 border border-purple-500/50 rounded-full animate-[spin_3s_linear_infinite_reverse]" />

                                {/* Core Robot Body */}
                                <div className="w-4 h-4 bg-black border border-cyan-400 rounded flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.8)] z-20">
                                    <div className="w-2 h-1 bg-cyan-200 animate-pulse" />
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Features List */}
                    <div className="space-y-32 pl-12 md:pl-24">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.id}
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8 }}
                                className="relative flex flex-col lg:flex-row gap-12 items-start"
                            >
                                {/* Text Content */}
                                <div className="flex-1 space-y-6">
                                    <div className="flex items-center gap-4">
                                        <span className="text-4xl font-black text-cyan-950/50 select-none">#{feature.id}</span>
                                        <h3 className="text-3xl md:text-5xl font-bold text-white">
                                            {feature.title} <span className={cn(
                                                "block text-transparent bg-clip-text bg-gradient-to-r",
                                                feature.id === '02' ? "from-purple-400 to-pink-400" : "from-cyan-400 to-blue-400"
                                            )}>{feature.highlight}</span>
                                        </h3>
                                    </div>
                                    <ul className="space-y-3">
                                        {feature.description.map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-gray-400 font-mono text-sm md:text-base">
                                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-cyan-500" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Visual Side */}
                                <div className="flex-1 w-full">
                                    <div className="relative group p-1">
                                        <div className={cn(
                                            "absolute inset-0 bg-gradient-to-r opacity-20 blur-2xl transition-all duration-500 group-hover:opacity-40",
                                            feature.id === '02' ? "from-purple-600 to-pink-600" : "from-cyan-600 to-blue-600"
                                        )} />

                                        <div className="relative bg-black/80 border border-white/10 p-6 md:p-8 rounded-xl backdrop-blur-md overflow-hidden hover:border-white/20 transition-colors">
                                            <div className="absolute top-0 right-0 p-4 opacity-20">
                                                <div className="w-24 h-24">{feature.icon}</div>
                                            </div>

                                            <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
                                                <div className="w-3 h-3 rounded-full bg-red-500/20" />
                                                <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                                                <div className="w-3 h-3 rounded-full bg-green-500/20" />
                                                <div className="ml-auto text-[10px] font-mono text-white/30">SYS.LOG.V{feature.id}</div>
                                            </div>

                                            <div className="h-48 md:h-64 w-full bg-black/50 rounded border border-white/5 relative overflow-hidden group-hover:bg-black/40 transition-colors">
                                                {feature.id === '01' && (
                                                    <div className="p-4 font-mono text-xs text-cyan-300 opacity-80 leading-relaxed">
                                                        <span className="text-purple-400">while</span>(alive) {'{'}<br />
                                                        &nbsp;&nbsp;<span className="text-yellow-400">scan</span>();<br />
                                                        &nbsp;&nbsp;<span className="text-blue-400">targets</span>.forEach(t ={'>'} {'{'}<br />
                                                        &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">if</span>(t.weak) <span className="text-red-400">attack</span>(t);<br />
                                                        &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">else</span> <span className="text-green-400">flank</span>(t);<br />
                                                        &nbsp;&nbsp;{'}'});<br />
                                                        {'}'}
                                                        <div className="absolute bottom-2 right-2 flex gap-1">
                                                            <div className="w-1 h-1 bg-cyan-500 animate-pulse" />
                                                            <div className="w-1 h-1 bg-cyan-500 animate-pulse delay-75" />
                                                            <div className="w-1 h-1 bg-cyan-500 animate-pulse delay-150" />
                                                        </div>
                                                    </div>
                                                )}

                                                {feature.id === '02' && (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="w-32 h-32 border border-purple-500/30 rounded-full flex items-center justify-center animate-[spin_10s_linear_infinite]">
                                                            <div className="w-24 h-24 border border-purple-400/50 rounded-full border-dashed flex items-center justify-center animate-[spin_8s_linear_infinite_reverse]" />
                                                        </div>
                                                        <div className="absolute text-purple-300 font-mono text-xs tracking-widest">CONNECTING</div>
                                                    </div>
                                                )}

                                                {feature.id === '03' && (
                                                    <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-1 p-2 opacity-50">
                                                        {Array.from({ length: 36 }).map((_, i) => (
                                                            <div key={i} className={cn(
                                                                "rounded-sm transition-colors duration-500",
                                                                (i + 1) % 3 === 0 ? "bg-green-500/40" : "bg-white/5",
                                                                "hover:bg-green-400/60"
                                                            )} />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
