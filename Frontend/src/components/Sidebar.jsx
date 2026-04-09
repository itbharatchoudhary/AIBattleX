import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(iso) {
  const d = new Date(iso);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return 'Today';
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default function Sidebar({ history, onSelectHistory, onClearHistory, darkMode, onToggleDark, onNewBattle, onProfile, user, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="glass border-r border-slate-200 dark:border-white/10 flex flex-col h-full shrink-0 overflow-hidden"
    >
      {/* Top Logo Row */}
      <div className="flex items-center h-14 px-3 border-b border-slate-200 dark:border-white/10 shrink-0">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-violet-500/30">
          <span className="text-sm">⚔️</span>
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="ml-2.5 overflow-hidden"
            >
              <span className="font-bold text-sm gradient-text whitespace-nowrap">Battle Arena</span>
              <p className="text-slate-500 dark:text-white/30 text-[10px] whitespace-nowrap">AI Comparison Engine</p>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          id="sidebar-collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto btn-ghost p-1.5 rounded-lg shrink-0"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg className={`w-3.5 h-3.5 transition-transform ${collapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* New Battle Button */}
      <div className="px-2 py-3 shrink-0">
        <button
          id="new-battle-btn"
          onClick={onNewBattle}
          className={`
            w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold
            bg-gradient-to-r from-violet-600/80 to-blue-600/80
            hover:from-violet-500/90 hover:to-blue-500/90
            active:scale-95 transition-all duration-200
            shadow-md shadow-violet-500/20
            ${collapsed ? 'justify-center' : ''}
          `}
        >
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          {!collapsed && <span>New Battle</span>}
        </button>
      </div>

      {/* Profile Button */}
      {/* <div className="px-2 pb-3 shrink-0">
        <button
          id="profile-btn"
          onClick={onProfile}
          className={`
            w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium
            glass-hover transition-all
            ${collapsed ? 'justify-center' : ''}
          `}
          title="User Profile"
        >
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {!collapsed && <span>Profile</span>}
        </button>
      </div> */}

      {/* History */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {!collapsed && (
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-white/30 font-semibold">History</span>
            {history.length > 0 && (
              <button
                onClick={() => confirmClear ? (onClearHistory(), setConfirmClear(false)) : setConfirmClear(true)}
                onBlur={() => setTimeout(() => setConfirmClear(false), 300)}
                className="text-[10px] text-slate-400 dark:text-white/30 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              >
                {confirmClear ? 'Confirm?' : 'Clear'}
              </button>
            )}
          </div>
        )}

        {history.length === 0 && !collapsed && (
          <div className="flex flex-col items-center justify-center py-8 text-slate-400 dark:text-white/20 text-xs text-center gap-2">
            <span className="text-2xl">🏟️</span>
            <p>No battles yet.<br />Start your first one!</p>
          </div>
        )}

        <div className="flex flex-col gap-1">
          {history.map((entry) => (
            <button
              key={entry.id}
              onClick={() => onSelectHistory(entry)}
              className={`
                w-full text-left rounded-xl transition-all duration-150 glass-hover
                ${collapsed ? 'p-2 flex justify-center' : 'px-3 py-2.5'}
              `}
              title={entry.problem}
            >
              {collapsed ? (
                <span className="text-base">⚔️</span>
              ) : (
                <div>
                  <p className="text-xs text-slate-700 dark:text-white/70 font-medium truncate leading-tight mb-0.5">
                    {entry.problem}
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-white/30">
                    <span>{formatDate(entry.timestamp)}</span>
                    <span>·</span>
                    <span>{formatTime(entry.timestamp)}</span>
                    {entry.result?.judge && (
                      <>
                        <span>·</span>
                        <span className="text-violet-500 dark:text-violet-400">
                          {entry.result.judge.solution_1_score > entry.result.judge.solution_2_score
                            ? '🔥 Mistral'
                            : entry.result.judge.solution_2_score > entry.result.judge.solution_1_score
                            ? '⚡ Cohere'
                            : '🤝 Tie'}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* User Info / Profile Entry */}
      <div className="px-2 py-3 border-t border-slate-200 dark:border-white/10 shrink-0">
        <div
          onClick={onProfile}
          title="Open profile"
          className={`
            flex items-center gap-3 px-3 py-2 rounded-xl glass cursor-pointer
            ${collapsed ? 'justify-center' : ''}
            hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors
          `}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-sm shrink-0">
            {user?.avatar || '👤'}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 dark:text-white truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-slate-500 dark:text-white/60 truncate">
                {user?.plan === 'free' ? 'Free User' : `${user?.plan?.charAt(0).toUpperCase() + user?.plan?.slice(1)} User`}
              </p>
            </div>
          )}
          <button
            onClick={(event) => {
              event.stopPropagation();
              onLogout();
            }}
            className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors shrink-0"
            title="Logout"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>

      {/* Footer: Dark Mode Toggle */}
      <div className="px-2 py-3 border-t border-slate-200 dark:border-white/10 shrink-0">
        <button
          id="dark-mode-toggle"
          onClick={onToggleDark}
          className={`
            w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium
            glass-hover transition-all
            ${collapsed ? 'justify-center' : ''}
          `}
          title="Toggle dark/light mode"
        >
          <span className="text-base shrink-0">{darkMode ? '☀️' : '🌙'}</span>
          {!collapsed && (
            <span className="text-slate-600 dark:text-white/50">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
