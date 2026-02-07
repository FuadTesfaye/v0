"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Github, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Features", href: "/#features" },
        { name: "Lore", href: "/#lore" },
        { name: "FAQs", href: "/#faq" },
        { name: "Docs", href: "/docs" },
    ];

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={cn(
                "fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300",
                "w-[95%] max-w-5xl rounded-full border border-white/10",
                scrolled
                    ? "bg-black/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] py-3 px-6"
                    : "bg-black/40 backdrop-blur-sm py-4 px-8"
            )}
        >
            <div className="flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-4 group">
                    <div className="relative w-12 h-12 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                        <Image
                            src="/assets/logo.svg"
                            alt="AlgoWars Logo"
                            width={48}
                            height={48}
                            className="object-contain drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                        />
                    </div>
                    <span className="font-mono font-black text-2xl tracking-widest text-white group-hover:text-cyan-400 transition-colors drop-shadow-md">
                        ALGOWARS
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-10">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-base font-bold text-white/80 hover:text-cyan-400 transition-colors relative group uppercase tracking-wider"
                        >
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-cyan-400 transition-all duration-300 group-hover:w-full box-shadow-[0_0_8px_cyan]" />
                        </Link>
                    ))}
                </div>

                {/* Actions */}
                <div className="hidden md:flex items-center gap-6">
                    <Link
                        href="/login"
                        className="text-base font-bold text-white hover:text-cyan-300 transition-colors uppercase tracking-wide"
                    >
                        Log In
                    </Link>
                    <Link
                        href="/signup"
                        className="group relative px-6 py-2.5 overflow-hidden rounded-full bg-white text-black font-black text-sm transition-transform hover:scale-105 shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.6)]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors">
                            JOIN BETA <ChevronRight className="w-5 h-5" />
                        </span>
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                </button>
            </div>

            {/* Mobile Menu Overlay - Adjusted for floating nav */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="absolute top-full left-0 right-0 mt-4 bg-black/90 border border-white/10 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl"
                    >
                        <div className="flex flex-col p-6 gap-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-xl font-bold text-white/90 hover:text-cyan-400 tracking-wider"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <hr className="border-white/10 my-2" />
                            <Link
                                href="/login"
                                className="text-xl font-bold text-white hover:text-cyan-400 tracking-wider"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                LOG IN
                            </Link>
                            <Link
                                href="/signup"
                                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-center font-black text-white hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-shadow tracking-widest"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                GET STARTED
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};
