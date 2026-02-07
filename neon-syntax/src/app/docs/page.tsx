"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { cn } from "@/lib/utils";
import { ChevronRight, Terminal, Cpu, Database, Book, Shield, Zap, Code, AlertTriangle } from "lucide-react";

// --- Components ---

const Section = ({ id, title, icon: Icon, children }: { id: string; title: string; icon?: any; children: React.ReactNode }) => (
    <section id={id} className="mb-16 scroll-mt-32">
        <div className="flex items-center gap-3 mb-6 group">
            {Icon && (
                <div className="p-2 rounded bg-cyan-950/30 border border-cyan-500/20 text-cyan-400 group-hover:text-cyan-200 group-hover:border-cyan-400/50 transition-all">
                    <Icon className="w-6 h-6" />
                </div>
            )}
            <h2 className="text-3xl font-bold text-white tracking-tight group-hover:text-cyan-400 transition-colors">
                {title}
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-cyan-900/50 to-transparent ml-4" />
        </div>
        <div className="text-gray-400 leading-relaxed space-y-4">
            {children}
        </div>
    </section>
);

const CodeBlock = ({ title, code, language = "typescript" }: { title?: string; code: string; language?: string }) => (
    <div className="my-6 rounded-lg overflow-hidden border border-white/10 bg-black/50 backdrop-blur-sm group hover:border-cyan-500/30 transition-colors">
        {title && (
            <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
                <span className="text-xs font-mono text-cyan-300">{title}</span>
                <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500/50" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                    <div className="w-2 h-2 rounded-full bg-green-500/50" />
                </div>
            </div>
        )}
        <div className="p-4 overflow-x-auto relative">
            <div className="absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')] opacity-20 mix-blend-soft-light" />
            <pre className="text-sm font-mono text-gray-300 relative z-10">
                <code>{code}</code>
            </pre>
        </div>
    </div>
);

const InfoCard = ({ title, value, label }: { title: string; value: string; label?: string }) => (
    <div className="p-4 rounded border border-white/10 bg-white/5 hover:bg-white/10 hover:border-cyan-500/30 transition-all group">
        <h4 className="text-gray-400 text-xs font-mono mb-1 uppercase tracking-wider">{title}</h4>
        <div className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">{value}</div>
        {label && <div className="text-xs text-cyan-500/70 mt-1">{label}</div>}
    </div>
)

const Table = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
    <div className="overflow-hidden rounded border border-white/10 bg-white/5 my-6">
        <table className="w-full text-left text-sm">
            <thead>
                <tr className="bg-white/5 border-b border-white/10">
                    {headers.map((h, i) => (
                        <th key={i} className="px-4 py-3 font-mono text-cyan-400 font-medium">{h}</th>
                    ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
                {rows.map((row, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                        {row.map((cell, j) => (
                            <td key={j} className="px-4 py-3 text-gray-300 font-mono">{cell}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
)


// --- Main Page ---

export default function DocsPage() {
    const [activeSection, setActiveSection] = useState("introduction");

    // Scroll spy to update active section
    useEffect(() => {
        const handleScroll = () => {
            const sections = document.querySelectorAll("section");
            sections.forEach((section) => {
                const top = section.offsetTop;
                const height = section.offsetHeight;
                if (window.scrollY >= top - 200 && window.scrollY < top + height - 200) {
                    setActiveSection(section.id);
                }
            });
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            window.scrollTo({ top: el.offsetTop - 120, behavior: "smooth" });
            setActiveSection(id);
        }
    };

    const menuItems = [
        { id: "introduction", label: "Introduction", icon: Terminal },
        { id: "getting-started", label: "Getting Started", icon: Zap },
        { id: "core-mechanics", label: "Core Mechanics", icon: Cpu },
        { id: "units", label: "Unit Database", icon: Database },
        { id: "scripting-api", label: "Scripting API", icon: Code },
        { id: "lore", label: "Archives (Lore)", icon: Book },
    ];

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-cyan-500/30 selection:text-cyan-100">
            <Navbar />

            {/* Background Ambience */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/20 blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-900/10 blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')] opacity-5 mix-blend-soft-light" />
            </div>

            <div className="relative z-10 pt-32 pb-20 container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">

                    {/* Sidebar Navigation */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-32 space-y-8">
                            <div>
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 pl-3">Documentation</h4>
                                <nav className="space-y-1">
                                    {menuItems.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => scrollTo(item.id)}
                                            className={cn(
                                                "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 group text-left",
                                                activeSection === item.id
                                                    ? "bg-cyan-950/40 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                                            )}
                                        >
                                            <item.icon className={cn("w-4 h-4", activeSection === item.id ? "text-cyan-400" : "text-gray-500 group-hover:text-gray-300")} />
                                            {item.label}
                                            {activeSection === item.id && (
                                                <motion.div layoutId="active-pill" className="absolute left-0 w-1 h-6 bg-cyan-400 rounded-r-full" />
                                            )}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            <div className="p-4 rounded border border-white/10 bg-gradient-to-br from-white/5 to-transparent">
                                <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                                    Beta Status
                                </h4>
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    This documentation reflects version <span className="text-cyan-400 font-mono">0.1.0-alpha</span>. Features may change rapidly.
                                </p>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="min-h-screen">

                        {/* Header */}
                        <div className="mb-16">
                            <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-500">
                                NEON SYNTAX <span className="block text-2xl md:text-3xl text-gray-400 font-bold mt-2 tracking-normal font-mono">Documentation Hub</span>
                            </h1>
                            <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
                                The comprehensive guide to the Neon Syntax protocol. Learn to command your units, optimize your algorithms, and dominate the grid.
                            </p>
                        </div>

                        <Section id="introduction" title="Introduction" icon={Terminal}>
                            <p>
                                <strong>Neon Syntax</strong> is a programmable strategy game where victory isn't determined by reflexes, but by logic. You assume the role of an Operator in a dystopian cyberpunk future, commanding automated units via direct code injection.
                            </p>
                            <p>
                                Unlike traditional RTS games, you do not directly control units with mouse clicks. Instead, you write scripts that define their behavior. Your code runs in real-time on the battlefield, executing your strategies autonomously.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                <InfoCard title="Genre" value="Prog. Strategy" label="RTS / Coding" />
                                <InfoCard title="Language" value="TypeScript" label="Subset / ES6" />
                                <InfoCard title="Engine" value="Custom" label="React + Canvas" />
                                <InfoCard title="Version" value="0.1.0" label="Early Access" />
                            </div>
                        </Section>

                        <Section id="getting-started" title="Getting Started" icon={Zap}>
                            <p>
                                To begin your first operation, navigate to the <strong>AlgoWars</strong> section from the main menu. You will be presented with a customized IDE and a visual representation of the battlefield.
                            </p>
                            <h3 className="text-xl font-bold text-white mt-8 mb-4">The Interface</h3>
                            <ul className="list-disc pl-6 space-y-2 marker:text-cyan-500">
                                <li><strong>Editor Pane:</strong> The left side of the screen where you write your logic.</li>
                                <li><strong>Simulation Grid:</strong> The right side visualization of the battlefield.</li>
                                <li><strong>Console:</strong> Displays logs, errors, and system messages from your units.</li>
                            </ul>
                            <div className="mt-6 p-4 border-l-4 border-cyan-500 bg-cyan-950/20">
                                <p className="text-cyan-200 text-sm">
                                    <strong>Tip:</strong> You can pause the simulation at any time to debug your code. Changes to your scripts are applied immediately upon saving/recompiling.
                                </p>
                            </div>
                        </Section>

                        <Section id="core-mechanics" title="Core Mechanics" icon={Cpu}>
                            <p>
                                The battlefield is represented as a 2D grid. Coordinates are 0-indexed, starting from the top-left (0,0).
                            </p>
                            <h3 className="text-xl font-bold text-white mt-8 mb-4">The Grid</h3>
                            <p>
                                Each tile on the grid can contain:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 marker:text-cyan-500">
                                <li><strong>Empty Space:</strong> Traversable by all ground units.</li>
                                <li><strong>Obstacles:</strong> Walls, debris, or buildings that block movement and line of sight.</li>
                                <li><strong>Resources:</strong> Data Nodes or Energy Cells that can be harvested.</li>
                                <li><strong>Units:</strong> Friendly or hostile bots.</li>
                            </ul>

                            <h3 className="text-xl font-bold text-white mt-8 mb-4">Turn Execution</h3>
                            <p>
                                Although the game appears real-time, it runs on a "tick" system. Each tick represents 100ms of game time. Your `update()` function is called once per tick for every unit you control.
                            </p>
                        </Section>

                        <Section id="units" title="Unit Database" icon={Database}>
                            <p>
                                Different chassis are available for deployment, each with unique stats and capabilities.
                            </p>
                            <Table
                                headers={["Class", "Health", "Speed", "Range", "Cost", "Description"]}
                                rows={[
                                    ["Scout", "100", "Fast", "2", "50", "High mobility recon unit. Weak armor."],
                                    ["Tank", "400", "Slow", "4", "150", "Heavy armor main battle tank."],
                                    ["Sniper", "80", "Med", "8", "120", "Long range engagement specialist."],
                                    ["Tower", "1000", "Static", "6", "200", "Defensive structure. Cannot move."]
                                ]}
                            />
                        </Section>

                        <Section id="scripting-api" title="Scripting API" icon={Code}>
                            <p>
                                All units expose a global API that you can access within your scripts. The `this` context refers to the current unit instance.
                            </p>

                            <h3 className="text-xl font-bold text-white mt-8 mb-4">Movement & Actions</h3>

                            <CodeBlock
                                title="Basic Movement"
                                code={`// Move the unit in a cardinal direction
this.move("UP" | "DOWN" | "LEFT" | "RIGHT");

// Example: Move towards distinct coordinates
if (this.x < target.x) {
    this.move("RIGHT");
}`}
                            />

                            <CodeBlock
                                title="Combat"
                                code={`// Fire main weapon at target coordinates
// Returns true if fired (check cooldowns)
this.attack(x, y);

// Example: Attack nearest enemy
const enemy = this.scan().find(e => e.team !== this.team);
if (enemy) {
    this.attack(enemy.x, enemy.y);
}`}
                            />

                            <h3 className="text-xl font-bold text-white mt-8 mb-4">Sensing</h3>
                            <CodeBlock
                                title="Radar"
                                code={`// Returns an array of objects within sensor range
const entities = this.scan();

// Entity Interface
interface Entity {
    id: string;
    type: "UNIT" | "WALL" | "RESOURCE";
    x: number;
    y: number;
    team?: string;
    hp?: number;
}`}
                            />
                        </Section>

                        <Section id="lore" title="Archives (Lore)" icon={Book}>
                            <p className="italic text-cyan-400/80 mb-6 font-serif text-lg">
                                "The Great Disconnect of 2099 left the world's infrastructure fragmented. Now, Corporate City-States fight proxy wars using automated drone armies. You are a Cipher—a mercenary tactician selling your algorithms to the highest bidder."
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 rounded border border-white/10 bg-white/5 relative overflow-hidden group hover:border-purple-500/50 transition-colors">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                                        <Shield className="w-24 h-24" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Neon Syndicate</h3>
                                    <p className="text-sm text-gray-400">
                                        A collective of hacker-activists seeking to liberate data from corporate silos. They favor speed, stealth, and electronic warfare units.
                                    </p>
                                </div>

                                <div className="p-6 rounded border border-white/10 bg-white/5 relative overflow-hidden group hover:border-blue-500/50 transition-colors">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                                        <Database className="w-24 h-24" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">OmniCorp</h3>
                                    <p className="text-sm text-gray-400">
                                        The ruling hegemony controlling 80% of the world's energy grid. Their units are heavily armored, expensive, and devastating.
                                    </p>
                                </div>
                            </div>
                        </Section>

                        {/* Footer Area */}
                        <div className="mt-32 pt-16 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
                            <div>
                                &copy; 2026 Neon Syntax. System Active.
                            </div>
                            <div className="flex gap-6 mt-4 md:mt-0">
                                <a href="#" className="hover:text-cyan-400 transition-colors">GitHub</a>
                                <a href="#" className="hover:text-cyan-400 transition-colors">Discord</a>
                                <a href="#" className="hover:text-cyan-400 transition-colors">Twitter</a>
                            </div>
                        </div>

                    </main>
                </div>
            </div>
        </div>
    );
}
