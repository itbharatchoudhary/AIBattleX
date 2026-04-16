import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SolutionCard, { MODELS } from '../components/SolutionCard';
import JudgePanel from '../components/JudgePanel';
import ModelSelector from '../components/ModelSelector';
import PromptInput from '../components/PromptInput';
import { EmptyState, ErrorBanner } from '../components/common/Feedback';

function BattleView({ result, isLoading, selectedModels }) {
  const winner =
    result?.judge
      ? result.judge.solution_1_score > result.judge.solution_2_score
        ? selectedModels.modelA
        : result.judge.solution_2_score > result.judge.solution_1_score
        ? selectedModels.modelB
        : 'tie'
      : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col gap-8 pb-12"
    >
      {/* VS Header Bar */}
      <div className="flex items-center gap-4 shrink-0 px-2">
        <div className="flex-1 h-px bg-gradient-to-r from-orange-500/10 dark:from-orange-500/20 to-transparent" />
        <div className="flex items-center gap-3 px-4 py-2 rounded-full glass border border-slate-200 dark:border-white/5 text-[10px] font-bold tracking-widest uppercase">
          <span className="text-orange-500 dark:text-orange-400">{MODELS[selectedModels.modelA]?.icon} {MODELS[selectedModels.modelA]?.name}</span>
          <span className="text-slate-400 dark:text-white/20">VS</span>
          <span className="text-violet-500 dark:text-violet-400">{MODELS[selectedModels.modelB]?.icon} {MODELS[selectedModels.modelB]?.name}</span>
        </div>
        <div className="flex-1 h-px bg-gradient-to-l from-violet-500/10 dark:from-violet-500/20 to-transparent" />
      </div>

      {/* Split Cards */}
      <div className="flex-none grid grid-cols-2 gap-4 min-h-[400px]">
        <SolutionCard
          model={selectedModels.modelA}
          content={result?.solution_1}
          isLoading={isLoading}
          isWinner={winner === selectedModels.modelA}
        />
        <SolutionCard
          model={selectedModels.modelB}
          content={result?.solution_2}
          isLoading={isLoading}
          isWinner={winner === selectedModels.modelB}
        />
      </div>

      {/* Judge Panel */}
      <div className="shrink-0">
        <JudgePanel
          judge={result?.judge}
          isLoading={isLoading}
          problem={result?.problem}
          judgeModel={selectedModels.judgeModel}
          selectedModels={selectedModels}
        />
      </div>
    </motion.div>
  );
}

export default function ArenaPage({
  result,
  error,
  selectedModels,
  setSelectedModels,
  submitProblem,
  reset,
  retry,
  isLoading,
  hasResult
}) {
  const showBattle = isLoading || hasResult;

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      {/* Top Bar - Fixed */}
      <div className="flex items-center justify-between px-6 py-5 shrink-0 border-b border-slate-200/50 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-md z-20">
        <div>
          <h2 className="text-base font-semibold text-slate-800 dark:text-white/90 font-sans">
            {isLoading
              ? '⚔️ Battle in progress…'
              : hasResult
              ? '🏆 Battle Complete'
              : 'New Battle'}
          </h2>
          <p className="text-slate-500 dark:text-white/40 text-[11px] mt-0.5 font-sans">
            {isLoading
              ? `${MODELS[selectedModels.modelA]?.name} & ${MODELS[selectedModels.modelB]?.name} are generating responses…`
              : hasResult
              ? `${MODELS[selectedModels.judgeModel]?.name} has delivered the verdict.`
              : 'Ask any question to pit two AIs against each other.'}
          </p>
        </div>

        {/* Live indicator when loading */}
        {isLoading && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-white/60">
            <span className="w-2 h-2 rounded-full bg-green-500 dark:bg-green-400 animate-pulse" />
            Live
          </div>
        )}
      </div>

      {/* Scrollable Main Area */}
      <div className="flex-1 overflow-y-auto px-6 pt-6 custom-scrollbar scroll-smooth relative">
        <div className="max-w-5xl mx-auto w-full space-y-8 pb-40">
          {/* Error Banner */}
          <AnimatePresence>
            {error && (
              <ErrorBanner message={error} onDismiss={reset} onRetry={retry} />
            )}
          </AnimatePresence>

          {/* Model Selectors Panel */}
          <div className="glass rounded-2xl p-4 border border-slate-200/50 dark:border-white/5 bg-slate-50/30 dark:bg-white/[0.02]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 px-1">
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 dark:text-white/20"> ARENA CONFIGURATION</h3>
              <div className="h-px flex-1 bg-slate-200/50 dark:bg-white/5 hidden md:block mx-4" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 dark:text-white/30 ml-1 uppercase">Contender A</label>
                <ModelSelector
                  value={selectedModels.modelA}
                  onChange={(value) => setSelectedModels(prev => ({ ...prev, modelA: value }))}
                  disabled={isLoading}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 dark:text-white/30 ml-1 uppercase">Contender B</label>
                <ModelSelector
                  value={selectedModels.modelB}
                  onChange={(value) => setSelectedModels(prev => ({ ...prev, modelB: value }))}
                  disabled={isLoading}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 dark:text-white/30 ml-1 uppercase">Supreme Judge</label>
                <ModelSelector
                  value={selectedModels.judgeModel}
                  onChange={(value) => setSelectedModels(prev => ({ ...prev, judgeModel: value }))}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Content Area */}
          <AnimatePresence mode="wait">
            {showBattle ? (
              <BattleView
                key="battle"
                result={result}
                isLoading={isLoading}
                selectedModels={selectedModels}
              />
            ) : (
              <EmptyState key="empty" />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Fixed Bottom Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-6 sticky-input-container z-30">
        <div className="max-w-4xl mx-auto w-full">
          <PromptInput
            onSubmit={submitProblem}
            isLoading={isLoading}
            onReset={reset}
            hasResult={hasResult}
            models={selectedModels}
          />
        </div>
      </div>
    </div>
  );
}
