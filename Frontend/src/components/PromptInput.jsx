import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function PromptInput({ onSubmit, isLoading, onReset, hasResult }) {
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
    onSubmit(value);
    // Reset height after submit
    if (textareaRef.current) {
      textareaRef.current.value = '';
      textareaRef.current.style.height = 'auto';
    }
  };

  return (
    <div className="glass rounded-2xl p-1 gradient-border">
      <div className="relative rounded-[14px] overflow-hidden bg-slate-900/5 dark:bg-black/20">
        <textarea
          ref={textareaRef}
          id="prompt-input"
          rows={1}
          disabled={isLoading}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          className="
            w-full bg-transparent px-5 pt-4 pb-2 text-sm text-slate-800 dark:text-white
            placeholder-slate-400 dark:placeholder-white/30 resize-none focus:outline-none
            disabled:opacity-50 disabled:cursor-not-allowed
            leading-relaxed overflow-hidden py-1.5
          "
          placeholder="Ask anything… Enter to submit, Shift+Enter for new line"
        />

        <div className="flex items-center justify-between px-4 pb-3 pt-1">
          <div className="flex items-center gap-2 text-slate-400 dark:text-white/25 text-xs">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-white/40 font-mono text-[10px]">⌘</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-white/40 font-mono text-[10px]">↵</kbd>
            <span>to submit</span>
          </div>

          <div className="flex gap-2">
            {hasResult && (
              <button
                id="retry-btn"
                onClick={onReset}
                className="btn-ghost text-xs px-3 py-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                New Battle
              </button>
            )}
            <motion.button
              id="submit-btn"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={submit}
              disabled={isLoading}
              className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
            >
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Battling…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Start Battle
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
