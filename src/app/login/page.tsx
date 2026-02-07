"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Github, Mail, Chrome } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Mock login for now
            await new Promise(resolve => setTimeout(resolve, 1000));
            router.push("/");
        } catch (err) {
            setError("Login failed. Please try again.");
            setLoading(false);
        }
    };

    const handleSocialLogin = async (provider: 'github' | 'google') => {
        setLoading(true);
        console.log(`Authenticating with ${provider}...`);
        alert(`Integration for ${provider} coming soon!`);
        setLoading(false);
    };

    return (
        <main className="min-h-screen w-full bg-[#020205] text-white overflow-hidden relative font-sans">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 blur-[150px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[150px] rounded-full animate-pulse" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
            </div>

            <Navbar />

            <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                >
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-white/40 text-sm">
                            Access your AlgoWars terminal securely.
                        </p>
                    </div>

                    {/* Social Auth */}
                    <div className="flex flex-col gap-3 mb-6">
                        <button
                            onClick={() => handleSocialLogin("google")}
                            disabled={loading}
                            className="flex items-center justify-center gap-3 w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all text-sm font-medium group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Chrome className="w-5 h-5 text-white/80 group-hover:text-white" />
                            Continue with Google
                        </button>
                        <button
                            onClick={() => handleSocialLogin("github")}
                            disabled={loading}
                            className="flex items-center justify-center gap-3 w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all text-sm font-medium group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Github className="w-5 h-5 text-white/80 group-hover:text-white" />
                            Continue with GitHub
                        </button>
                    </div>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[#050510] px-2 text-white/30">Or continue with email</span>
                        </div>
                    </div>

                    {/* Email Form */}
                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs">
                                {error}
                            </div>
                        )}
                        <div>
                            <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="operative@algowars.io"
                                required
                                className="w-full px-4 py-2.5 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 text-white placeholder-white/20 transition-all font-mono text-sm"
                            />
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-xs font-medium text-white/50 uppercase tracking-wider">Password</label>
                                <Link href="#" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">Forgot?</Link>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full px-4 py-2.5 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 text-white placeholder-white/20 transition-all font-mono text-sm"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 mt-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        >
                            {loading ? "Initializing Session..." : "Initialize Session"}
                        </button>
                    </form>

                    <div className="text-center mt-6 text-sm text-white/40">
                        Don't have an account?{" "}
                        <Link href="/signup" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                            Join Beta
                        </Link>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
