'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { MinusIcon, PlusIcon } from 'lucide-react';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'gameplay' | 'technical' | 'story';
}

const faqItems: FaqItem[] = [
  {
    id: '1',
    question: 'What is AlgoWars?',
    answer:
      'AlgoWars is a programmable tactical strategy game where you control units by writing code. It combines grid-based combat with real-time logic execution, set in a dystopian cyberpunk future.',
    category: 'gameplay',
  },
  {
    id: '2',
    question: 'Do I need to know how to code?',
    answer:
      'Basic logic skills are helpful, but the game is designed to teach you. You start with simple commands and unlock complex functions as you progress through the sectors.',
    category: 'gameplay',
  },
  {
    id: '3',
    question: 'How does the "Robot" companion work?',
    answer:
      "The companion bot is your avatar in the system. It executes your scripts in real-time. In the landing simulation, it follows your cursor to demonstrate the grid interaction engine.",
    category: 'gameplay',
  },
  {
    id: '4',
    question: 'What programming language is used?',
    answer:
      "The game uses a custom JavaScript-like syntax. It's safe, sandboxed, and optimized for tactical operations. You can loop, use conditionals, and define custom functions for your units.",
    category: 'technical',
  },
  {
    id: '5',
    question: 'Is it real-time or turn-based?',
    answer:
      'It uses a hybrid system. You plan your code in a paused state (Tactical Mode) and then execute it in real-time bursts. Efficiency and timing are key to survival.',
    category: 'gameplay',
  },
  {
    id: '6',
    question: 'What is the "Sector 7" mentioned in the logs?',
    answer:
      "Sector 7 is the starting quarantine zone where new neural links are established. It's where you'll prove your worth before accessing the deeper network layers.",
    category: 'story',
  },
];

const categories = [
  { id: 'all', label: 'ALL_DATA' },
  { id: 'gameplay', label: 'TACTICS' },
  { id: 'technical', label: 'SYSTEM' },
  { id: 'story', label: 'LORE' },
];

export default function Faq2() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredFaqs =
    activeCategory === 'all'
      ? faqItems
      : faqItems.filter((item) => item.category === activeCategory);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="relative py-24 z-20 pointer-events-auto">
      <div className="container mx-auto max-w-5xl px-4 md:px-6">
        <div className="mb-12 flex flex-col items-center">
          <Badge
            variant="outline"
            className="border-cyan-500/50 text-cyan-400 mb-4 px-3 py-1 text-xs font-mono tracking-widest uppercase bg-cyan-950/30"
          >
            DATABASE_QUERY
          </Badge>

          <h2 className="text-white mb-6 text-center text-3xl font-black tracking-tight md:text-5xl [text-shadow:0_0_10px_rgba(0,170,255,0.4)]">
            SYSTEM_FAQ
          </h2>

          <p className="text-cyan-200/60 max-w-2xl text-center font-mono text-sm leading-relaxed">
            Accessing common queries regarding the AlgoWars protocol.
            Decrypting answers for new operators.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                'rounded-none border px-6 py-2 text-xs font-bold tracking-widest transition-all font-mono',
                activeCategory === category.id
                  ? 'bg-cyan-500 text-black border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                  : 'bg-black/50 text-cyan-500/70 border-cyan-500/30 hover:border-cyan-400 hover:text-cyan-400',
              )}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <AnimatePresence>
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className={cn(
                  'border w-full overflow-hidden transition-all duration-300',
                  expandedId === faq.id
                    ? 'border-cyan-400 bg-cyan-950/20 shadow-[0_0_20px_rgba(6,182,212,0.1)]'
                    : 'border-cyan-500/20 bg-black/40 hover:border-cyan-500/40',
                )}
              >
                <button
                  onClick={() => toggleExpand(faq.id)}
                  className="flex w-full items-center justify-between p-6 text-left group"
                >
                  <h3 className={cn(
                    "text-sm font-bold tracking-wide transition-colors font-mono",
                    expandedId === faq.id ? "text-cyan-300" : "text-white/80 group-hover:text-cyan-200"
                  )}>
                    <span className="text-cyan-600 mr-2 opacity-50">//{faq.id}</span>
                    {faq.question}
                  </h3>
                  <div className="ml-4 flex-shrink-0">
                    {expandedId === faq.id ? (
                      <MinusIcon className="text-cyan-400 h-4 w-4" />
                    ) : (
                      <PlusIcon className="text-cyan-500/50 group-hover:text-cyan-400 h-4 w-4" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {expandedId === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-cyan-500/20 px-6 py-4 bg-cyan-950/10">
                        <p className="text-cyan-100/70 text-sm leading-relaxed font-mono">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
