import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MODELS } from './SolutionCard';

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function groupHistoryByDate(history) {
  const groups = {
    Today: [],
    Yesterday: [],
    'Previous 7 Days': [],
    Earlier: []
  };

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 7);

  history.forEach(entry => {
    const entryDate = new Date(entry.timestamp);
    if (isNaN(entryDate.getTime())) return; // Skip invalid dates

    if (entryDate >= today) {
      groups.Today.push(entry);
    } else if (entryDate >= yesterday) {
      groups.Yesterday.push(entry);
    } else if (entryDate >= lastWeek) {
      groups['Previous 7 Days'].push(entry);
    } else {
      groups.Earlier.push(entry);
    }
  });

  return Object.entries(groups).filter(([_, items]) => items.length > 0);
}

function HistoryItem({ entry, onSelect, onDelete, collapsed }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative group px-2"
    >
      <button
        onClick={() => onSelect(entry)}
        className={`
          w-full text-left rounded-xl transition-all duration-200 border border-transparent
          hover:bg-slate-200/50 dark:hover:bg-white/5 group-hover:pr-10
          ${collapsed ? 'p-2 flex justify-center' : 'px-3 py-2.5'}
        `}
        title={entry.problem}
      >
        {collapsed ? (
          <span className="text-base">⚔️</span>
        ) : (
          <div className="flex flex-col gap-0.5">
            <p className="text-[13px] text-slate-700 dark:text-white/80 font-medium truncate leading-snug">
              {entry.problem}
            </p>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-white/20">
              <span>{formatTime(entry.timestamp)}</span>
              {entry.result?.judge && (
                <>
                  <span>·</span>
                  <span className="text-slate-500/80 dark:text-slate-400/50">
                    {entry.result.judge.solution_1_score > entry.result.judge.solution_2_score
                      ? `${MODELS[entry.models?.modelA]?.name}`
                      : entry.result.judge.solution_2_score > entry.result.judge.solution_1_score
                      ? `${MODELS[entry.models?.modelB]?.name}`
                      : 'Tie'}
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </button>

      {!collapsed && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(entry.id);
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-all duration-200"
          title="Delete battle"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )}
    </motion.div>
  );
}

export default function Sidebar({ 
  history, 
  onSelectHistory, 
  onClearHistory, 
  onDeleteHistory,
  darkMode, 
  onToggleDark, 
  onNewBattle, 
  onProfile, 
  user, 
  onLogout 
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const groupedHistory = useMemo(() => groupHistoryByDate(history), [history]);

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="glass border-r border-slate-200 dark:border-white/5 flex flex-col h-full shrink-0 overflow-hidden relative z-40"
    >
      {/* Top Logo Row */}
      <div className="flex items-center h-16 px-4 border-b border-slate-200 dark:border-white/5 shrink-0">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shrink-0 shadow-lg shadow-black/20">
          <span className="text-sm">⚔️</span>
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="ml-3 overflow-hidden"
            >
              <span className="font-bold text-sm tracking-tight gradient-text whitespace-nowrap">Battle Arena</span>
              <p className="text-slate-400 dark:text-white/20 text-[10px] uppercase font-bold tracking-tighter whitespace-nowrap">Engine Pro</p>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors shrink-0"
        >
          <svg className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* New Battle Button */}
      <div className="px-4 py-4 shrink-0">
        <button
          onClick={onNewBattle}
          className={`
            w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-semibold
            bg-slate-800 dark:bg-white text-white dark:text-slate-900
            hover:opacity-90 active:scale-[0.98] transition-all duration-200
            shadow-xl shadow-slate-900/10 dark:shadow-white/5
            ${collapsed ? 'justify-center' : ''}
          `}
        >
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          {!collapsed && <span>New Battle</span>}
        </button>
      </div>

      {/* History Section */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        {!collapsed && (
          <div className="flex items-center justify-between px-6 mb-3 shrink-0">
            <span className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-white/20 font-bold">History</span>
            {history.length > 0 && (
              <button
                onClick={() => confirmClear ? (onClearHistory(), setConfirmClear(false)) : setConfirmClear(true)}
                onBlur={() => setTimeout(() => setConfirmClear(false), 300)}
                className="text-[10px] text-slate-400 hover:text-red-500 dark:hover:text-red-400 font-medium transition-colors"
              >
                {confirmClear ? 'Confirm?' : 'Clear'}
              </button>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-2 space-y-6 pb-4">
          {history.length === 0 && !collapsed && (
            <div className="flex flex-col items-center justify-center py-12 text-slate-300 dark:text-white/10 text-xs text-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-current flex items-center justify-center text-xl">🏟️</div>
              <p className="font-medium">No recent battles.<br />Ready to start?</p>
            </div>
          )}

          {groupedHistory.map(([label, items]) => (
            <div key={label} className="space-y-1">
              {!collapsed && (
                <div className="px-4 py-2 sticky top-0 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md z-10">
                  <span className="text-[11px] font-bold text-slate-400 dark:text-white/10">{label}</span>
                </div>
              )}
              <div className="flex flex-col gap-0.5">
                <AnimatePresence>
                  {items.map(entry => (
                    <HistoryItem 
                      key={entry.id} 
                      entry={entry} 
                      onSelect={onSelectHistory} 
                      onDelete={onDeleteHistory}
                      collapsed={collapsed}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Profile Section */}
      <div className="p-3 border-t border-slate-200 dark:border-white/5  shrink-0">
        <div
          onClick={onProfile}
          className={`
            flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-200/50 dark:hover:bg-white/5 
            cursor-pointer transition-all duration-200
            ${collapsed ? 'justify-center px-0' : ''}
          `}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-sm shrink-0 border border-white/10 shadow-lg">
            {user?.avatar || '👤'}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-slate-800 dark:text-white/90 truncate leading-tight">
                {user?.name || 'Researcher'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-white/30 truncate uppercase font-bold tracking-tighter">
                {user?.plan === 'free' ? 'Standard Tier' : `${user?.plan} Access`}
              </p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLogout();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/5 transition-all"
              title="End Session"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Theme Toggle */}
      {!collapsed && (
        <div className="px-4 pb-4">
          <button
            onClick={onToggleDark}
            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 hover:opacity-80 transition-all text-[11px] font-bold text-slate-500 dark:text-white/30 uppercase tracking-tighter"
          >
            <span>Appearance</span>
            <span className="text-base">{darkMode ? '☀️' : '🌙'}</span>
          </button>
        </div>
      )}
    </motion.aside>
  );
}
