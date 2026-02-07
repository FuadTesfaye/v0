
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export default function AudienceSection() {
    return (
        <section className="py-24 bg-[#050505]">
            <div className="container mx-auto px-6 text-center max-w-4xl">
                <h2 className="text-3xl md:text-4xl font-black text-white mb-12 uppercase tracking-wide">
                    Who Is This For?
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <AudienceCard
                        title="Developers"
                        desc="Test your algorithmic thinking in a sandbox that respects your intelligence. No hand-holding."
                    />
                    <AudienceCard
                        title="Strategists"
                        desc="Micro-management is dead. Macro-strategy and automated tactics are the new meta."
                    />
                    <AudienceCard
                        title="Learners"
                        desc="The most engaging way to master logic flow, state management, and optimization."
                    />
                </div>

                <div className="mt-16 pt-16 border-t border-white/10">
                    <p className="text-white/60 text-lg">
                        AlgoWars is not a toy. It is not an academic simulator. <br />
                        <span className="text-white font-bold">It is a competitive arena for the intellectual elite.</span>
                    </p>
                </div>
            </div>
        </section>
    );
}

function AudienceCard({ title, desc }: { title: string, desc: string }) {
    return (
        <div className="p-8 rounded-2xl bg-black border border-white/10 hover:border-cyan-500/50 transition-all hover:-translate-y-1">
            <div className="w-12 h-12 bg-cyan-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4 font-mono">{title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
                {desc}
            </p>
        </div>
    )
}
