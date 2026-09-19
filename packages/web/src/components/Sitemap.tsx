import React, { useEffect } from 'react';
import {
  ArrowLeft,
  Map,
  Gamepad2,
  Sparkles,
  Palette,
  BookOpen,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

export const Sitemap: React.FC = () => {
  useEffect(() => {
    document.title = 'Sitemap & Application Directory — 2048 Game';
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      title: 'Game Boards & Modes',
      icon: Gamepad2,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10 dark:bg-amber-500/20',
      links: [
        {
          name: '4x4 Classic Board',
          desc: 'The original, iconic 2048 grid layout loved by millions',
          url: '/',
        },
        {
          name: '3x3 Mini Speed Grid',
          desc: 'Compact, intense puzzle challenge requiring precise moves',
          url: '/',
        },
        {
          name: '5x5 Expanded Grid',
          desc: 'Endurance mode with extra space for chasing higher tiles',
          url: '/',
        },
        {
          name: '6x6 Giant Grid',
          desc: 'Massive board designed for reaching 16,384, 32,768, and beyond',
          url: '/',
        },
      ],
    },
    {
      title: 'AI Solver & Productivity Tools',
      icon: Sparkles,
      color: 'text-indigo-500',
      bg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
      links: [
        {
          name: 'Expectimax AI Move Hint',
          desc: 'Calculates monotonicity, smoothness, and corner weights to suggest the optimal move',
          url: '/',
        },
        {
          name: 'AI Auto-Play Solver',
          desc: 'Automatic engine executing high-probability moves in real time',
          url: '/',
        },
        {
          name: 'Unlimited Move Undo',
          desc: 'Roll back accidental swipes and experiment with branching tactics',
          url: '/',
        },
        {
          name: 'Local Career Statistics',
          desc: 'Real-time tracking of win rate, lifetime moves, best score, and highest tile',
          url: '/',
        },
      ],
    },
    {
      title: 'Aesthetics & Sound Engineering',
      icon: Palette,
      color: 'text-pink-500',
      bg: 'bg-pink-500/10 dark:bg-pink-500/20',
      links: [
        {
          name: 'Dark Obsidian Theme',
          desc: 'Deep slate #090d16 mode optimized for low-light play',
          url: '/',
        },
        {
          name: 'Classic 2048 Warm Palette',
          desc: 'Warm beige and iconic golden tile styling inspired by the original',
          url: '/',
        },
        {
          name: 'Cyberpunk Neon Theme',
          desc: 'Electric high-contrast glow for modern visual flair',
          url: '/',
        },
        {
          name: 'Synthesized Web Audio Engine',
          desc: 'Pure browser-generated acoustic clicks, slides, pops, and win fanfare',
          url: '/',
        },
      ],
    },
    {
      title: 'Strategy Guides & Documentation',
      icon: BookOpen,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      links: [
        {
          name: 'The Corner Anchor Strategy',
          desc: 'Locking your largest tile in one corner to prevent trapped positions',
          url: '/#how-to-play',
        },
        {
          name: 'Monotonic Snake Pattern',
          desc: 'Arranging rows in descending order to chain cascading merges',
          url: '/#how-to-play',
        },
        {
          name: 'Free Cell Preservation Tactic',
          desc: 'Maintaining board mobility and avoiding premature game over states',
          url: '/#how-to-play',
        },
        {
          name: 'Frequently Asked Questions',
          desc: 'Complete Q&A covering rules, AI heuristics, and offline mechanics',
          url: '/#faq',
        },
      ],
    },
    {
      title: 'Legal, Metadata & Creator Profile',
      icon: ShieldCheck,
      color: 'text-cyan-500',
      bg: 'bg-cyan-500/10 dark:bg-cyan-500/20',
      links: [
        {
          name: 'Privacy Policy',
          desc: '100% offline, local-only storage, zero analytics, zero cookies',
          url: '/privacy',
        },
        {
          name: 'XML Sitemap (Search Engine Index)',
          desc: 'Machine-readable search engine index file for Googlebot',
          url: '/sitemap.xml',
          external: true,
        },
        {
          name: 'Developer Portfolio (Shoaib M. Arif)',
          desc: 'Explore personal portfolio, projects, and full-stack software work',
          url: 'https://shoaibarif.vercel.app/',
          external: true,
        },
        {
          name: 'GitHub Source Repository',
          desc: 'Inspect the open-source TypeScript monorepo on GitHub',
          url: 'https://github.com/shoaibmarif',
          external: true,
        },
        {
          name: 'LinkedIn Profile',
          desc: 'Connect with creator Shoaib M. Arif on LinkedIn',
          url: 'https://www.linkedin.com/in/shoaibmarif/',
          external: true,
        },
      ],
    },
  ];

  return (
    <article className="w-full max-w-4xl mx-auto py-8 px-4 text-slate-800 dark:text-slate-200">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-8">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-amber-500 hover:text-amber-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to 2048 Game</span>
        </a>

        <a
          href="/sitemap.xml"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400 hover:text-amber-500 transition-colors"
        >
          <span>View sitemap.xml</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Hero Header */}
      <header className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20 mb-3">
          <Map className="w-4 h-4" />
          <span>Application Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          Sitemap & Directory
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          Explore all game modes, intelligent AI solvers, visual themes, strategy guides, and documentation available in the 2048 application.
        </p>
      </header>

      {/* Structured Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {sections.map((sec, idx) => {
          const Icon = sec.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2.5 rounded-2xl ${sec.bg} ${sec.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    {sec.title}
                  </h2>
                </div>

                <div className="space-y-3">
                  {sec.links.map((link, lIdx) => (
                    <a
                      key={lIdx}
                      href={link.url}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      className="block p-3 rounded-2xl bg-white/70 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/40 dark:border-slate-700/40 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 group-hover:text-amber-500 transition-colors">
                          {link.name}
                        </span>
                        {link.external && (
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-500 transition-colors" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {link.desc}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Return Button */}
      <div className="text-center">
        <a
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-sm shadow-md shadow-amber-500/20 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to 2048 Game</span>
        </a>
      </div>
    </article>
  );
};
