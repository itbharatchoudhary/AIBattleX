import { useState } from 'react';
import { motion } from 'framer-motion';
import { MODELS } from './SolutionCard';

export default function ModelSelector({ label, value, onChange, disabled = false }) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedModel = MODELS[value];

  return (
    <div className="relative">
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl glass border border-slate-200 dark:border-white/10 text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="flex items-center gap-2">
          <span>{selectedModel?.icon}</span>
          <span className="text-slate-700 dark:text-white/80">{selectedModel?.name}</span>
        </div>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="absolute top-full left-0 right-0 mt-1 z-10"
        >
          <div className="glass rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden">
            {Object.entries(MODELS).map(([key, model]) => (
              <button
                key={key}
                onClick={() => {
                  onChange(key);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-white/5 transition-colors ${
                  key === value ? 'bg-slate-100 dark:bg-white/10' : ''
                }`}
              >
                <span>{model.icon}</span>
                <span className="flex-1 text-left">{model.name}</span>
                {/* Status indicator - green for available, red for circuit broken */}
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500" title="Available" />
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}