import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function ScoreBar({ label, score, color, isWinner, delay = 0 }) {
  const pct = Math.min(100, Math.max(0, (score / 10) * 100));
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const duration = 1400;

  useEffect(() => {
    const timeout = setTimeout(() => {
      const animate = (timestamp) => {
        if (!startRef.current) startRef.current = timestamp;
        const progress = Math.min((timestamp - startRef.current) / duration, 1);
        // easeOutCubic
        const ease = 1 - Math.pow(1 - progress, 3);
        setCount(parseFloat((ease * score).toFixed(1)));
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate);
        }
      };
      rafRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      startRef.current = null;
    };
  }, [score, delay]);

  const stars = Math.round(score / 2);

  return (
    <div
      className={`relative rounded-2xl p-4 transition-all duration-300 ${isWinner
          ? 'ring-2 ring-yellow-400/60 bg-yellow-400/10 dark:bg-yellow-400/5'
          : 'bg-slate-200/60 dark:bg-white/5'
        }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isWinner && (
            <span className="text-lg" title="Winner">👑</span>
          )}
          <span className="font-semibold text-sm text-slate-800 dark:text-white/90">
            {label}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-yellow-500 dark:text-yellow-400 text-xs tracking-wider">
            {'⭐'.repeat(stars)}{'☆'.repeat(5 - stars)}
          </span>

          <span
            className={`text-2xl font-bold tabular-nums ${isWinner
                ? 'text-yellow-500 dark:text-yellow-400'
                : 'text-slate-900 dark:text-white/80'
              }`}
          >
            {count.toFixed(1)}
          </span>

          <span className="text-slate-500 dark:text-white/40 text-sm">
            /10
          </span>
        </div>
      </div>

      <div className="h-2.5 rounded-full bg-slate-300 dark:bg-white/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{
            duration: 1.4,
            delay: delay / 1000,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      </div>
    </div>
  );
}
