import React from 'react';
import { motion } from 'framer-motion';

export function AppLoader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white px-6">
      <div className="flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 shadow-2xl shadow-violet-500/40 mb-6 font-sans">
        <span className="text-4xl animate-bounce">⚔️</span>
      </div>
      <h1 className="text-4xl font-bold mb-2 font-sans tracking-tight">Battle Arena</h1>
      <p className="max-w-md text-center text-slate-300 mb-8 font-sans">
        Initializing the ultimate AI showdown...
      </p>
      <div className="w-40 h-1.5 rounded-full overflow-hidden bg-white/10">
        <div className="h-full bg-gradient-to-r from-violet-500 via-blue-500 to-violet-500 animate-progress origin-left" />
      </div>
    </div>
  );
}

export function ErrorBanner({ message, onDismiss, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 shadow-xl backdrop-blur-xl"
    >
      <div className="p-2 rounded-full bg-red-500/20">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-red-200">Execution Error</p>
        <p className="text-xs opacity-80">{message}</p>
      </div>
      <div className="flex items-center gap-2">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-bold transition-all"
          >
            Retry
          </button>
        )}
        <button 
          onClick={onDismiss}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
        <div className="relative w-24 h-24 rounded-3xl bg-slate-900 border border-white/10 flex items-center justify-center text-5xl shadow-2xl">
          ⚔️
        </div>
      </div>
      <h2 className="text-3xl font-bold text-white mb-4">Ready for Battle?</h2>
      <p className="text-slate-400 max-w-sm mb-8">
        Configure your models above and enter a prompt below to see which AI reigns supreme.
      </p>
      <div className="flex gap-4">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-violet-500" />
          High Performance
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Smart Evaluation
        </div>
      </div>
    </motion.div>
  );
}
