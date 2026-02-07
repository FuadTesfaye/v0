
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, Terminal, Crosshair, Trophy } from 'lucide-react';

interface ModeCardProps {
    title: string;
    description: string;
    href: string;
    icon: React.ReactNode;
    disabled?: boolean;
    comingSoon?: boolean;
}

const ModeCard: React.FC<ModeCardProps> = ({ title, description, href, icon, disabled = false, comingSoon = false }) => {

    // Custom styling for "Coming Soon" state
    if (comingSoon) {
        return (
            <div className="relative group h-full">
                {/* Neon Glow Background */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>

                <div className="relative h-full flex flex-col p-6 rounded-xl bg-black border border-slate-800 backdrop-blur-xl">

                    {/* Coming Soon Badge */}
                    <div className="absolute top-0 right-0 mt-0 mr-0">
                        <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl shadow-lg shadow-purple-500/20">
                            COMING_SOON
                        </div>
                    </div>

                    {/* Icon Header */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-lg bg-pink-500/10 text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                            {icon}
                        </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                        {title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed mb-6 flex-1">
                        {description}
                    </p>

                    {/* Footer Action (Disabled) */}
                    <div className="flex items-center text-xs font-bold text-slate-600 cursor-not-allowed">
                        <Lock size={14} className="mr-2" /> ACCESS_RESTRICTED
                    </div>
                </div>
            </div>
        );
    }

    const content = (
        <motion.div
            whileHover={!disabled ? { scale: 1.02, borderColor: '#06b6d4' } : {}}
            className={`
        relative group flex flex-col p-6 rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm
        ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]'}
        transition-all duration-300 h-full
      `}
        >
            {/* Icon Header */}
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${disabled ? 'bg-slate-800 text-slate-500' : 'bg-cyan-500/10 text-cyan-400 group-hover:text-cyan-300'}`}>
                    {icon}
                </div>
                {disabled && <Lock size={16} className="text-slate-600" />}
            </div>

            {/* Content */}
            <h3 className={`text-xl font-bold mb-2 ${disabled ? 'text-slate-500' : 'text-slate-100 group-hover:text-cyan-50'}`}>
                {title}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6 flex-1">
                {description}
            </p>

            {/* Footer Action */}
            {!disabled && (
                <div className="flex items-center text-xs font-bold text-cyan-500 group-hover:translate-x-1 transition-transform">
                    INITIALIZE_PROTOCOL <ArrowRight size={14} className="ml-1" />
                </div>
            )}
        </motion.div>
    );

    if (disabled) {
        return <div>{content}</div>;
    }

    return (
        <Link href={href} className="block h-full">
            {content}
        </Link>
    );
};

export default ModeCard;
