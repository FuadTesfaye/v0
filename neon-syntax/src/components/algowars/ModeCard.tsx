
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
}

const ModeCard: React.FC<ModeCardProps> = ({ title, description, href, icon, disabled = false }) => {
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
