
import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Upload, Cpu, Play, Share2 } from 'lucide-react';

const steps = [
    {
        icon: Terminal,
        title: "Write Logic",
        desc: "Script your unit behaviors using a JavaScript-like syntax. Define movement, combat, and resource gathering protocols."
    },
    {
        icon: Upload,
        title: "Deploy Code",
        desc: "Upload your algorithms to the secure game server. Your code is sandboxed and pre-validated for syntax errors."
    },
    {
        icon: Cpu,
        title: "Execute Match",
        desc: "The server runs a deterministic simulation. Your units act autonomously based strictly on your logic."
    },
    {
        icon: Play,
        title: "Observe Outcome",
        desc: "Watch the battle unfold in real-time. Analyze unit decisions, debugging logs, and execution efficiency."
    },
    {
        icon: Share2,
        title: "Iterate & Dominate",
        desc: "Refine your strategies based on match data. optimize your code to outsmart opponents in the next iteration."
    }
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 bg-black relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(20,20,20,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(20,20,20,0.5)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-500 mb-6 tracking-tighter">
                        SYSTEM ARCHITECTURE
                    </h2>
                    <p className="text-cyan-400/60 font-mono text-sm uppercase tracking-[0.2em]">
            // EXECUTION_PIPELINE
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center text-center group">
                            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 relative group-hover:border-cyan-500/50 transition-colors">
                                <step.icon className="w-8 h-8 text-cyan-400 group-hover:text-white transition-colors" />
                                <div className="absolute -inset-2 bg-cyan-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                            </div>

                            {/* Connecting Line (except last) */}
                            {index < steps.length - 1 && (
                                <div className="hidden md:block absolute top-[28%] left-[calc(50%+4rem)] w-[calc(100%-8rem)] h-[2px] bg-gradient-to-r from-cyan-900/50 to-transparent pointer-events-none" />
                            )}

                            <h3 className="text-xl font-bold text-white mb-3 font-mono">{step.title}</h3>
                            <p className="text-sm text-gray-400 leading-relaxed max-w-[200px]">
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
