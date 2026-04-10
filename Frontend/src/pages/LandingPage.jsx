import React from 'react';
import { motion } from 'framer-motion';

export default function LandingPage({ onEnter }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white px-6 font-sans">
      <div className="rounded-[2.5rem] bg-slate-900/80 border border-white/10 shadow-2xl shadow-slate-950/40 p-10 max-w-xl w-full text-center backdrop-blur-sm">
        <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mx-auto mb-6 w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-500/20"
        >
          <span className="text-4xl text-white">⚔️</span>
        </motion.div>
        
        <h1 className="text-4xl font-semibold mb-3 tracking-tight">AI Battle Arena</h1>
        <p className="text-slate-400 mb-8 text-sm leading-7">
          Battle Arena is an experimental AI evaluation station. Sign in to compare the world's most powerful language models side-by-side with an automated judge.
        </p>
        
        <button
          onClick={onEnter}
          className="group relative inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 px-8 py-4 text-white font-bold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-0.5 transition-all active:scale-95"
        >
          <span>Enter the Arena</span>
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
