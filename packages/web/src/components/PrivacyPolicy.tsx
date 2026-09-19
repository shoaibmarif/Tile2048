import React, { useEffect } from 'react';
import { ArrowLeft, ShieldCheck, Lock, EyeOff, Database } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
    // Rule D: Ensure noindex, follow on /privacy to prevent SERP cannibalization
    let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    let created = false;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      document.head.appendChild(meta);
      created = true;
    }
    const prevContent = meta.content;
    meta.content = 'noindex, follow';

    return () => {
      if (created && meta) {
        meta.remove();
      } else if (meta) {
        meta.content = prevContent || 'index, follow';
      }
    };
  }, []);

  return (
    <article className="w-full max-w-3xl mx-auto py-8 px-4 text-slate-800 dark:text-slate-200">
      <a
        href="/"
        className="inline-flex items-center gap-2 text-sm font-semibold text-amber-500 hover:text-amber-600 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to 2048 Game</span>
      </a>

      <header className="mb-8">
        <div className="flex items-center gap-2 text-emerald-500 mb-2">
          <ShieldCheck className="w-6 h-6" />
          <span className="text-xs font-bold uppercase tracking-wider">Privacy First</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          Last updated: September 19, 2026
        </p>
      </header>

      <div className="space-y-6 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-400">
        <p>
          This Privacy Policy outlines how <strong>2048 Game</strong> (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) handles your data when you visit our website or use our Google Chrome Extension.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <Lock className="w-5 h-5 text-indigo-500 mb-2" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Zero Tracking</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">No third-party tracking scripts, cookies, or fingerprinting.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <Database className="w-5 h-5 text-amber-500 mb-2" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Local-Only Storage</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Scores, high score, and themes stay exclusively in your browser.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
            <EyeOff className="w-5 h-5 text-emerald-500 mb-2" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">100% Offline</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">The entire game engine and AI run in-memory on your CPU.</p>
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. Information Collection and Storage</h2>
          <p>
            We believe in total user privacy. We do not collect, store, or transmit any personally identifiable information (PII). Game data such as your current score, best score, move count, and preferred visual theme are stored strictly on your device using HTML5 <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-xs">localStorage</code> or Chrome Extension <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-xs">chrome.storage.local</code>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. Google Chrome Extension Privacy</h2>
          <p>
            The 2048 Chrome Extension operates fully offline. It does not request access to your browsing history, web pages, or online accounts. Any permissions requested (such as <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-xs">storage</code> and <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-xs">contextMenus</code>) are used solely to let you launch and save the game inside the extension popup.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">3. Third-Party Services</h2>
          <p>
            Our web application is statically hosted on Netlify. Netlify may process standard server access logs (such as IP addresses and request timestamps) strictly for security and abuse prevention. We do not integrate third-party analytics (such as Google Analytics) or advertising networks.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">4. Contact Information</h2>
          <p>
            If you have questions regarding this Privacy Policy or the 2048 game, you can reach out via GitHub at{' '}
            <a
              href="https://github.com/shoaibmarif"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-500 hover:underline font-semibold"
            >
              github.com/shoaibmarif
            </a>, explore my portfolio at{' '}
            <a
              href="https://shoaibarif.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-500 hover:underline font-semibold"
            >
              shoaibarif.vercel.app
            </a>, or connect with me on LinkedIn at{' '}
            <a
              href="https://www.linkedin.com/in/shoaibmarif/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-500 hover:underline font-semibold"
            >
              linkedin.com/in/shoaibmarif
            </a>.
          </p>
        </section>
      </div>
    </article>
  );
};
