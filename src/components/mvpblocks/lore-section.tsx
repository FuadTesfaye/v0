
import React from 'react';
import { motion } from 'framer-motion';
import { Network, Shield, Code2 } from 'lucide-react';

export default function LoreSection() {
    return (
        <section id="lore" className="py-24 bg-black relative border-y border-white/5 scroll-mt-24">
            <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Text Content */}
                <div className="space-y-8">
                    <div>
                        <h2 className="text-4xl font-black text-white mb-6 uppercase tracking-tight">
                            The Age of <span className="text-cyan-400">Silent Wars</span>
                        </h2>
                        <div className="h-1 w-20 bg-cyan-500 mb-8" />
                    </div>

                    <div className="space-y-6 text-gray-400 text-lg leading-relaxed">
                        <p>
                            The year is 2142. Physical conflict has been deemed obsolete and inefficient. The world is now governed by autonomous distributed systems—massive, self-regulating networks that control everything from energy grids to planetary defense protocols.
                        </p>
                        <p>
                            But peace is an illusion. Factions act through proxy algorithms, constantly vying for dominance over shared resources. When diplomatic protocols fail, conflicts are resolved in the digital ether. Not by soldiers, but by <span className="text-white font-bold">competing logic</span>.
                        </p>
                        <p>
                            In this era, pure AI lacks the creative spark to outmaneuver the unexpected. That is why human Operators are essential. Your ability to write adaptive, unpredictable, and ruthless code is the only weapon that matters.
                        </p>
                    </div>
                </div>

                {/* Visuals / Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card
                        icon={Network}
                        title="Decentralized Conflict"
                        desc="Battles occur across thousand of server nodes simultaneously."
                    />
                    <Card
                        icon={Code2}
                        title="Logic is Law"
                        desc="The most efficient algorithm always dictates the outcome."
                    />
                    <Card
                        icon={Shield}
                        title="Server Authority"
                        desc="The simulation is absolute. Cheating is mathematically impossible."
                    />
                    <div className="p-8 rounded-2xl border border-dashed border-white/20 flex items-center justify-center text-center">
                        <div className="text-cyan-500/50 font-mono text-sm">
                             // SYSTEM_STATUS: <br />
                            <span className="text-white">WAR_PROTOCOL_ACTIVE</span>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}

function Card({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-colors group">
            <Icon className="w-8 h-8 text-cyan-500 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-sm text-gray-400">{desc}</p>
        </div>
    )
}
