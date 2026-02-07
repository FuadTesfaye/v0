'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function AboutUs() {
    return (
        <section className="relative py-24 z-20 overflow-hidden bg-black/90">

            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
            <div className="absolute top-1/2 left-0 w-24 h-24 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute top-1/3 right-0 w-64 h-64 bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto max-w-6xl px-4 md:px-6 relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="space-y-8"
                    >
                        <div className="space-y-4">
                            <Badge
                                variant="outline"
                                className="border-cyan-500/50 text-cyan-400 px-3 py-1 text-xs font-mono tracking-widest uppercase bg-cyan-950/30"
                            >
                                SYSTEM_ORIGIN
                            </Badge>
                            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                                CODE IS <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 animate-pulse">POWER</span>
                            </h2>
                            <p className="text-cyan-100/70 text-lg leading-relaxed font-mono">
                                AlgoWars is not just a game; it's a <span className="text-cyan-400">testament to logic</span>.
                                Born from the need for a true server-authoritative strategy engine, we've built a world where
                                your ability to think algorithmically determines your survival.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start space-x-4 group">
                                <div className="w-12 h-12 rounded-lg bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center group-hover:border-cyan-400 transition-colors">
                                    <svg className="w-6 h-6 text-cyan-400" fill="none" rx="0" ry="0" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">Programmable Warfare</h3>
                                    <p className="text-sm text-gray-400 font-mono">
                                        Write real JavaScript-like syntax to automate your units. Build complex behaviors, loops, and conditional logic to outsmart your opponents.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4 group">
                                <div className="w-12 h-12 rounded-lg bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center group-hover:border-cyan-400 transition-colors">
                                    <svg className="w-6 h-6 text-cyan-400" fill="none" rx="0" ry="0" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">Serverless Architecture</h3>
                                    <p className="text-sm text-gray-400 font-mono">
                                        Powered by a deterministic, lazy-evaluation engine. Every move is calculated with precision on the server, ensuring a cheat-free, competitive environment.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4 group">
                                <div className="w-12 h-12 rounded-lg bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center group-hover:border-cyan-400 transition-colors">
                                    <svg className="w-6 h-6 text-cyan-400" fill="none" rx="0" ry="0" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">Real-Time Execution</h3>
                                    <p className="text-sm text-gray-400 font-mono">
                                        Plan your strategy in tactical mode, then watch as your code executes in real-time bursts. Adapt, rewriting your logic on the fly to counter enemy tactics.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Graphical/Visual Side */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative h-[500px] w-full bg-black/50 border border-cyan-500/20 rounded-xl overflow-hidden backdrop-blur-sm group"
                    >
                        {/* Abstract Code Visualization Overlay */}
                        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />

                        {/* Floating Code Snippets Mockup */}
                        <div className="absolute top-8 left-8 right-8 bottom-8 border border-white/10 rounded-lg p-6 bg-black/60 font-mono text-xs md:text-sm text-cyan-300/80 leading-relaxed overflow-hidden">
                            <div className="flex items-center space-x-2 mb-4 border-b border-white/10 pb-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                                <span className="text-white/30 ml-2">unit_controller.js</span>
                            </div>
                            <div className="space-y-1 opacity-80">
                                <p><span className="text-purple-400">function</span> <span className="text-yellow-300">executeProtocol</span>(target) {'{'}</p>
                                <p className="pl-4"><span className="text-purple-400">const</span> distance = <span className="text-blue-400">getDistance</span>(this.pos, target.pos);</p>
                                <p className="pl-4"><span className="text-purple-400">if</span> (distance {'<'} <span className="text-orange-400">RANGE_LIMIT</span>) {'{'}</p>
                                <p className="pl-8"><span className="text-green-400">// Engage visible target</span></p>
                                <p className="pl-8"><span className="text-blue-400">fireWeapon</span>(target.id);</p>
                                <p className="pl-8"><span className="text-blue-400">log</span>(<span className="text-green-300">"Target acquired."</span>);</p>
                                <p className="pl-4">{'}'} <span className="text-purple-400">else</span> {'{'}</p>
                                <p className="pl-8"><span className="text-blue-400">moveTo</span>(target.pos);</p>
                                <p className="pl-4">{'}'}</p>
                                <p>{'}'}</p>
                                <p className="mt-4"><span className="text-gray-500">/* System analyzing optimized path... */</span></p>
                                <p className="text-gray-500"> /* Neural link established... */</p>
                            </div>

                            {/* Scanline */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400/30 blur shadow-[0_0_10px_rgba(69,255,255,0.5)] animate-[scan_3s_linear_infinite]" />
                        </div>

                        {/* Corner Accents */}
                        <div className="absolute top-0 right-0 p-2">
                            <div className="w-16 h-16 border-t-2 border-r-2 border-cyan-500 rounded-tr-xl" />
                        </div>
                        <div className="absolute bottom-0 left-0 p-2">
                            <div className="w-16 h-16 border-b-2 border-l-2 border-cyan-500 rounded-bl-xl" />
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
