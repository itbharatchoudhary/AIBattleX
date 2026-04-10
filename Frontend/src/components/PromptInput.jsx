import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function PromptInput({ onSubmit, isLoading, onReset, hasResult, models }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  const handleInput = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const submit = () => {
    const value = textareaRef.current?.value?.trim();
    if (!value || isLoading) return;
    onSubmit(value, models);
    // Reset height after submit
    if (textareaRef.current) {
      textareaRef.current.value = '';
      textareaRef.current.style.height = 'auto';
    }
  };

  return (
    <div className="relative group">
      {/* Dynamic Glow Background */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500/20 to-blue-500/20 rounded-[22px] blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
      
      <div className="relative glass rounded-[20px] p-1 border border-slate-200 dark:border-white/5 shadow-2xl shadow-black/5 dark:shadow-black/20 overflow-hidden ring-1 ring-slate-200/50 dark:ring-white/5 focus-within:ring-violet-500/30">
        <div className="relative rounded-[16px] overflow-hidden bg-slate-50/50 dark:bg-black/10">
          <textarea
            ref={textareaRef}
            id="prompt-input"
            rows={1}
            disabled={isLoading}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            className="
              w-full bg-transparent px-5 pt-4 pb-2 text-sm text-slate-800 dark:text-white
              placeholder-slate-400 dark:placeholder-white/20 resize-none focus:outline-none
              disabled:opacity-50 disabled:cursor-not-allowed
              leading-relaxed overflow-hidden py-3
            "
            placeholder="Ask anything… Enter to submit, Shift+Enter for new line"
          />

          <div className="flex items-center justify-between px-4 pb-3 pt-1">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-slate-400 dark:text-white/20 text-[10px] font-medium tracking-wide">
                <kbd className="px-1.5 py-0.5 rounded bg-slate-200/50 dark:bg-white/5 border border-slate-300 dark:border-white/5 font-mono">⌘</kbd>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-200/50 dark:bg-white/5 border border-slate-300 dark:border-white/5 font-mono">↵</kbd>
                <span className="ml-1">TO SUBMIT</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {hasResult && (
                <button
                  id="retry-btn"
                  onClick={onReset}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold text-slate-500 dark:text-white/40 hover:bg-slate-200/50 dark:hover:bg-white/5 transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  NEW BATTLE
                </button>
              )}
              <motion.button
                id="submit-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={submit}
                disabled={isLoading}
                className="
                  inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold
                  bg-slate-900 dark:bg-white text-white dark:text-slate-900
                  disabled:opacity-40 disabled:cursor-not-allowed transition-all
                  shadow-lg shadow-black/10 dark:shadow-white/5
                "
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    <span>BATTLING</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>START BATTLE</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
