import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: 'How do you play 2048?',
    answer:
      'Use your arrow keys, WASD, or swipe on mobile to slide all tiles in one of four directions: Up, Down, Left, or Right. When two tiles with the same number touch, they merge into one with double the value (e.g., 2 + 2 = 4). Your goal is to create a tile with the number 2048!',
  },
  {
    question: 'What is the best strategy to win 2048?',
    answer:
      'The proven winning strategy is the Corner Strategy: pick one corner (such as bottom-left or top-left) and build your highest-value tile there. Never move away from that corner. Maintain a descending snake pattern (e.g. 1024, 512, 256, 128) across your main row.',
  },
  {
    question: 'Can you keep playing after reaching the 2048 tile?',
    answer:
      'Yes! When you reach the 2048 tile, you can click "Keep Playing" to aim for 4096, 8192, 16384, or even 131,072!',
  },
  {
    question: 'How does the AI Hint work?',
    answer:
      'The AI solver runs an Expectimax evaluation in your browser. It calculates the monotonicity, smoothness, corner anchoring, and empty cell flexibility across multiple future move permutations to suggest the optimal direction.',
  },
  {
    question: 'Is 2048 100% free and private?',
    answer:
      'Yes, this version of 2048 runs 100% in your browser using local computation. No accounts, cookies, or personal tracking are required.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section className="w-full max-w-lg mx-auto mt-10 mb-12">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="w-5 h-5 text-indigo-500" />
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="space-y-2.5">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/40 overflow-hidden transition-colors"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full p-4 text-left flex items-center justify-between gap-3 text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-amber-500 transition-colors"
                aria-expanded={isOpen}
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-4 h-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-amber-500' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-4 pb-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-200/30 dark:border-slate-700/30 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
