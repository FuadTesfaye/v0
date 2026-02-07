"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Github, Chrome, Shield } from "lucide-react";

export default function SignupPage() {
    const handleSocialLogin = (provider: string) => {
        alert(`Integration for ${provider} coming soon!`);
    };

    return (
        <main className="min-h-screen w-full bg-[#020205] text-white overflow-hidden relative font-sans">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] right-[20%] w-[60%] h-[60%] bg-blue-500/10 blur-[150px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] bg-cyan-500/10 blur-[150px] rounded-full animate-pulse" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
            </div>

            <Navbar />

            <div className="relative z-10 flex items-center justify-center min-h-screen px-4 pt-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_0_50px_rgba(34,211,238,0.15)]"
                >
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl mx-auto flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                            <Shield className="text-white w-6 h-6" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Join the Network
                        </h1>
                        <p className="text-white/40 text-sm">
                            Create your operator profile to begin.
                        </p>
                    </div>

                    <form className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">First Name</label>
                                <input
                                    type="text"
                                    placeholder="Alex"
                                    className="w-full px-4 py-2.5 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 text-white placeholder-white/20 transition-all font-mono text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Last Name</label>
                                <input
                                    type="text"
                                    placeholder="Mercer"
                                    className="w-full px-4 py-2.5 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 text-white placeholder-white/20 transition-all font-mono text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Email Address</label>
                            <input
                                type="email"
                                placeholder="operative@neonsyntax.io"
                                className="w-full px-4 py-2.5 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 text-white placeholder-white/20 transition-all font-mono text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Password</label>
                            <input
                                type="password"
                                placeholder="Create a strong password"
                                className="w-full px-4 py-2.5 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 text-white placeholder-white/20 transition-all font-mono text-sm"
                            />
                        </div>

                        <button
                            type="button"
                            className="w-full py-3 mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-lg shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all transform hover:-translate-y-0.5"
                        >
                            Create Account
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[#050510] px-2 text-white/30">Or sign up with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => handleSocialLogin("Google")}
                            className="flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all text-sm font-medium group"
                        >
                            <Chrome className="w-4 h-4 text-white/80 group-hover:text-white" />
                            Google
                        </button>
                        <button
                            onClick={() => handleSocialLogin("GitHub")}
                            className="flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all text-sm font-medium group"
                        >
                            <Github className="w-4 h-4 text-white/80 group-hover:text-white" />
                            GitHub
                        </button>
                    </div>

                    <div className="text-center mt-6 text-sm text-white/40">
                        Already have an account?{" "}
                        <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                            Log In
                        </Link>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
