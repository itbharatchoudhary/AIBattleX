import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import TypewriterText from './TypewriterText';
import Skeleton from './Skeleton';

const MODELS = {
  mistral: {
    name: 'Mistral',
    label: 'Mistral AI',
    icon: '🔥',
    accent: 'from-orange-500/20 to-amber-500/10',
    badge: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    ring: 'ring-orange-500/30',
    dot: 'bg-orange-400',
  },
  cohere: {
    name: 'Cohere',
    label: 'Cohere AI',
    icon: '⚡',
    accent: 'from-violet-500/20 to-purple-500/10',
    badge: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    ring: 'ring-violet-500/30',
    dot: 'bg-violet-400',
  },
};

export default function SolutionCard({ model, content, isLoading, isWinner }) {
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef(null);
  const meta = MODELS[model];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { }
  };

  const handleUpdate = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`
        glass rounded-2xl flex flex-col h-full overflow-hidden
        ${isWinner ? `ring-2 ${meta.ring}` : ''}
        bg-gradient-to-b ${meta.accent}
      `}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/50 dark:border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg bg-gradient-to-br ${meta.accent} border border-slate-200/50 dark:border-white/10`}>
            {meta.icon}
          </div>
          <div>
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${meta.badge}`}>
              <span className="text-slate-800 dark:text-white/80">
                {meta.label}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isWinner && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-yellow-300 dark:bg-yellow-400/15 border border-amber-500/20 dark:border-yellow-400/30">
              👑 Winner
            </span>
          )}
          {content && (
            <button
              id={`copy-${model}`}
              onClick={handleCopy}
              className="btn-ghost text-xs px-3 py-1.5 rounded-lg"
              title="Copy response"
            >
              {copied ? (
                <span className="flex items-center gap-1 text-green-400">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 text-sm leading-relaxed text-slate-700 dark:text-white/80 font-light scroll-smooth">
        {isLoading ? (
          <Skeleton />
        ) : content ? (
          <TypewriterText text={content} speed={2} onUpdate={handleUpdate} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-white/30 gap-3">
            <span className="text-4xl opacity-30">{meta.icon}</span>
            <p className="text-xs">Waiting for response…</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
