import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MODELS } from './SolutionCard';

export default function ModelSelector({ value, onChange, disabledSize, disabled = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef(null);
  const selectedModel = MODELS[value];

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const updateCoords = () => {
        if (!buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();
        setCoords({
          top: rect.bottom + 8,
          left: rect.left,
          width: rect.width
        });
      };
      
      updateCoords();
      window.addEventListener('resize', updateCoords);
      // Capture scroll events in the entire document to keep dropdown in sync
      window.addEventListener('scroll', updateCoords, true);
      
      return () => {
        window.removeEventListener('resize', updateCoords);
        window.removeEventListener('scroll', updateCoords, true);
      };
    }
  }, [isOpen]);

  const dropdownContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for closing */}
          <div 
            className="fixed inset-0 z-[9998]" 
            onClick={() => setIsOpen(false)} 
          />
          
          {/* Dropdown Card */}
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{ 
              position: 'fixed',
              top: coords.top,
              left: coords.left,
              width: Math.max(coords.width, 240),
              zIndex: 9999
            }}
          >
            <div className="glass rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl shadow-black/20 overflow-hidden p-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl ring-1 ring-black/5">
              <div className="px-3 py-2 text-[10px] font-bold text-slate-400 dark:text-white/20 uppercase tracking-widest border-b border-slate-100 dark:border-white/5 mb-1">
                Select AI Model
              </div>
              <div className="max-h-[320px] overflow-y-auto custom-scrollbar">
                {Object.entries(MODELS).map(([key, model]) => (
                  <button
                    key={key}
                    onClick={() => {
                      onChange(key);
                      setIsOpen(false);
                    }}
                    className={`
                      w-full group flex items-start gap-3 px-3 py-2.5 rounded-xl transition-all
                      ${key === value 
                        ? 'bg-violet-500/10 dark:bg-violet-500/20' 
                        : 'hover:bg-slate-100 dark:hover:bg-white/5'}
                    `}
                  >
                    <div className={`
                      w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0
                      bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10
                      group-hover:border-violet-500/30 transition-colors
                      ${key === value ? 'border-violet-500/30 bg-violet-500/10' : ''}
                    `}>
                      {model.icon}
                    </div>
                    <div className="flex-1 text-left min-w-0 font-sans">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-slate-800 dark:text-white/90">{model.name}</span>
                        {key === value && (
                          <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-white/40 leading-tight mt-0.5 line-clamp-1">
                        {model.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between px-4 py-2.5 rounded-xl
          bg-white/5 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10
          hover:border-slate-300 dark:hover:border-white/20 transition-all duration-200
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50 dark:hover:bg-white/[0.05]'}
          ${isOpen ? 'ring-2 ring-violet-500/20 border-violet-500/50' : ''}
        `}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-lg leading-none shrink-0">{selectedModel?.icon}</span>
          <span className="text-sm font-semibold text-slate-800 dark:text-white/90 truncate">{selectedModel?.name}</span>
        </div>
        <svg
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {typeof document !== 'undefined' && createPortal(dropdownContent, document.body)}
    </div>
  );
}