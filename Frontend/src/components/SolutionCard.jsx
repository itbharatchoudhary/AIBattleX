import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import TypewriterText from './TypewriterText';
import Skeleton from './Skeleton';

export const MODELS = {
  gemini: {
    name: 'Gemini',
    label: 'Google Gemini',
    description: 'Most versatile for creative & logical tasks.',
    icon: '🤖',
    accent: 'from-slate-500/20 to-slate-600/10',
    badge: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    ring: 'ring-slate-500/30',
    dot: 'bg-slate-400',
  },
  mistral: {
    name: 'Mistral',
    label: 'Mistral AI',
    description: 'Fast, efficient, and great for concise answers.',
    icon: '🔥',
    accent: 'from-slate-400/20 to-slate-500/10',
    badge: 'bg-slate-400/20 text-slate-300 border-slate-400/30',
    ring: 'ring-slate-400/30',
    dot: 'bg-slate-400',
  },
  cohere: {
    name: 'Cohere',
    label: 'Cohere AI',
    description: 'Excellent for RAG & complex reasoning.',
    icon: '⚡',
    accent: 'from-slate-600/20 to-slate-700/10',
    badge: 'bg-slate-600/20 text-slate-300 border-slate-600/30',
    ring: 'ring-slate-600/30',
    dot: 'bg-slate-400',
  },
  openai: {
    name: 'GPT-4o',
    label: 'OpenAI GPT-4o',
    description: 'High intelligence and complex instructions.',
    icon: '🧠',
    accent: 'from-slate-300/20 to-slate-400/10',
    badge: 'bg-slate-300/20 text-slate-300 border-slate-300/30',
    ring: 'ring-slate-300/30',
    dot: 'bg-slate-400',
  },
  claude: {
    name: 'Claude',
    label: 'Anthropic Claude',
    description: 'Nuanced reasoning and natural tone.',
    icon: '🦜',
    accent: 'from-slate-700/20 to-slate-800/10',
    badge: 'bg-slate-700/20 text-slate-300 border-slate-700/30',
    ring: 'ring-slate-700/30',
    dot: 'bg-slate-400',
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
        bg-opacity-50 dark:bg-opacity-40
      `}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-white/5 shrink-0">
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
      <div ref={scrollRef} className="flex-1 p-5 text-sm leading-relaxed text-slate-700 dark:text-white/80 font-light">
        {isLoading ? (
          <div className="space-y-4">
            {/* Progress indicator */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-white/50">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                Generating...
              </div>
            </div>
            <Skeleton />
          </div>
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
