import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import PromptInput from './components/PromptInput';
import SolutionCard, { MODELS } from './components/SolutionCard';
import JudgePanel from './components/JudgePanel';
import UserProfile from './components/UserProfile';
import Login from './components/Login';
import Register from './components/Register';
import VerifyEmail from './components/VerifyEmail';
import ModelSelector from './components/ModelSelector';
import api from './lib/axios';
import { useArena } from './hooks/useArena';

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4 }}
      className="h-screen flex flex-col items-center justify-center flex-1 gap-8 px-6 py-12 text-center"
    >
      {/* Hero icon */}
      <div className="relative">
        <div className="w-24 h-30 rounded-3xl bg-gradient-to-br from-violet-600/30 to-blue-600/30 border border-white/10 flex items-center justify-center text-5xl shadow-2xl shadow-violet-500/20">
          ⚔️
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-amber-400 border-2 border-slate-900 flex items-center justify-center text-xs">
          🔥
        </div>
        <div className="absolute -bottom-1 -left-1 w-6 h-6 rounded-full bg-gradient-to-br from-violet-600 to-purple-500 border-2 border-slate-900 flex items-center justify-center text-xs">
          ⚡
        </div>
      </div>

      <div className="max-w-md">
        <h1 className="text-3xl font-bold gradient-text mb-3">AI Battle Arena</h1>
        <p className="text-slate-600 dark:text-white/40 text-sm leading-relaxed">
          Submit any problem or question and watch{' '}
          <span className="text-orange-500 dark:text-orange-400 font-medium">AI models</span> compete for the best answer.{' '}
          <span className="text-blue-500 dark:text-blue-400 font-medium">Choose your models</span> and let the battle begin!
        </p>
      </div>

      {/* Feature pills */}
      <div className="flex flex-wrap gap-2 justify-center">
        {[
          { icon: '🤖', label: 'Multiple AI Models' },
          { icon: '⚖️', label: 'AI Judge' },
          { icon: '📊', label: 'Score Analysis' },
          { icon: '⚡', label: 'Real-time' },
        ].map(({ icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-xs text-slate-600 dark:text-white/50 border border-slate-200 dark:border-white/10"
          >
            <span>{icon}</span>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ErrorBanner({ message, onDismiss, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-sm"
    >
      <span className="text-base">⚠️</span>
      <span className="flex-1">{message}</span>
      <div className="flex items-center gap-2">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-3 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 hover:text-red-200 transition-colors text-xs font-medium"
          >
            Retry
          </button>
        )}
        <button onClick={onDismiss} className="text-red-400/60 hover:text-red-300 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}

function AppLoader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white px-6">
      <div className="flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 shadow-2xl shadow-violet-500/40 mb-6">
        <span className="text-4xl"></span>
      </div>
      <h1 className="text-4xl font-bold mb-2"> Battle Arena </h1>
      <p className="max-w-md text-center text-slate-300 mb-8">
        Experimental mode is active. Loading the Battle Arena experience for you now.
      </p>
      <div className="w-40 h-2 rounded-full overflow-hidden bg-white/10">
        <div className="h-full w-full bg-gradient-to-r from-violet-400 to-blue-400 animate-pulse" />
      </div>
    </div>
  );
}

function EntryScreen({ onEnter }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white px-6">
      <div className="rounded-[2.5rem] bg-slate-900/80 border border-white/10 shadow-2xl shadow-slate-950/40 p-10 max-w-xl w-full text-center">
        <div className="mx-auto mb-6 w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
          <span className="text-4xl"></span>
        </div>
        <h1 className="text-4xl font-semibold mb-3">Welcome</h1>
        <p className="text-slate-300 mb-8 text-sm leading-7">
          Battle Arena is an experimental AI battle station. Sign in or register after entering, and experience the profile, usage, and plan workflow.
        </p>
        <button
          onClick={onEnter}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 px-8 py-3 text-white font-semibold shadow-lg shadow-violet-500/30 hover:scale-[1.01] transition-all"
        >
          Enter the Arena
        </button>
      </div>
    </div>
  );
}

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
      className="flex-1 flex flex-col gap-4 min-h-0 overflow-y-auto pr-1 pb-4"
    >
      {/* VS Header Bar */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="flex-1 h-px bg-gradient-to-r from-orange-500/20 dark:from-orange-500/40 to-transparent" />
        <div className="flex items-center gap-3 px-4 py-1.5 rounded-full glass border border-slate-200 dark:border-white/10 text-xs font-bold">
          <span className="text-orange-500 dark:text-orange-400">{MODELS[selectedModels.modelA]?.icon} {MODELS[selectedModels.modelA]?.name}</span>
          <span className="text-slate-400 dark:text-white/30">VS</span>
          <span className="text-violet-500 dark:text-violet-400">{MODELS[selectedModels.modelB]?.icon} {MODELS[selectedModels.modelB]?.name}</span>
        </div>
        <div className="flex-1 h-px bg-gradient-to-l from-violet-500/20 dark:from-violet-500/40 to-transparent" />
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

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [currentView, setCurrentView] = useState('battle'); // 'battle' or 'profile'
  const [authView, setAuthView] = useState('login'); // 'login', 'register', or 'verify'
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [verificationMessage, setVerificationMessage] = useState('');
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [entryCompleted, setEntryCompleted] = useState(false);
  const [selectedModels, setSelectedModels] = useState(() => {
    const saved = localStorage.getItem('selectedModels');
    return saved ? JSON.parse(saved) : {
      modelA: 'mistral',
      modelB: 'mistral',
      judgeModel: 'mistral'
    };
  });
  const { status, result, error, history, submitProblem, retry, reset, loadFromHistory, clearHistory } = useArena();

  // Save selected models to localStorage
  useEffect(() => {
    localStorage.setItem('selectedModels', JSON.stringify(selectedModels));
  }, [selectedModels]);

  // Check for existing authentication on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        // Invalid stored data, clear it
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsAppLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Sync dark mode class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  const completeAuth = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    setCurrentView('battle');
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setCurrentView('battle');
  };

  const handleRegister = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setCurrentView('battle');
  };

  const handleRequireVerification = (email, message) => {
    setVerificationEmail(email);
    setVerificationMessage(message || 'Enter the verification code sent to your email.');
    setAuthView('verify');
  };

  const handleVerifyEmail = async (otp) => {
    if (!verificationEmail) return;
    setVerificationLoading(true);
    try {
      const response = await api.post('/auth/verify-otp', {
        email: verificationEmail,
        otp
      });

      completeAuth(response.data.token, response.data.user);
      setVerificationEmail('');
      setVerificationMessage('');
      setAuthView('login');
    } catch (err) {
      setVerificationMessage(err.response?.data?.error || err.message || 'Verification failed');
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!verificationEmail) return;
    setResendLoading(true);
    try {
      const response = await api.post('/auth/resend-otp', { email: verificationEmail });
      setVerificationMessage(response.data.message || 'A new code has been sent to your email.');
    } catch (err) {
      setVerificationMessage(err.response?.data?.error || err.message || 'Unable to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  const handleCancelVerification = () => {
    setAuthView('login');
    setVerificationEmail('');
    setVerificationMessage('');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setCurrentView('battle');
    reset();
  };

  const onProfile = () => setCurrentView('profile');
  const onNewBattle = () => {
    setCurrentView('battle');
    reset();
  };

  const isLoading = status === 'loading';
  const hasResult = status === 'success';
  const showBattle = isLoading || hasResult;

  if (isAppLoading) {
    return <AppLoader />;
  }

  return (
    <>
      {!entryCompleted ? (
        <EntryScreen onEnter={() => setEntryCompleted(true)} />
      ) : !isAuthenticated ? (
        authView === 'verify' ? (
          <VerifyEmail
            email={verificationEmail}
            message={verificationMessage}
            onVerify={handleVerifyEmail}
            onResend={handleResendOtp}
            onCancel={handleCancelVerification}
            isSubmitting={verificationLoading}
            isResending={resendLoading}
          />
        ) : authView === 'login' ? (
          <Login
            onLogin={handleLogin}
            onRequireVerification={handleRequireVerification}
            onSwitchToRegister={() => setAuthView('register')}
          />
        ) : (
          <Register
            onRegister={handleRegister}
            onRequireVerification={handleRequireVerification}
            onSwitchToLogin={() => setAuthView('login')}
          />
        )
      ) : (
        <Layout
          history={history}
          onSelectHistory={loadFromHistory}
          onClearHistory={clearHistory}
          darkMode={darkMode}
          onToggleDark={() => setDarkMode((d) => !d)}
          onNewBattle={onNewBattle}
          onProfile={onProfile}
          user={user}
          onLogout={handleLogout}
        >
          {currentView === 'profile' ? (
            <UserProfile onBack={() => setCurrentView('battle')} />
          ) : (
            <div className="flex flex-col h-full px-6 py-5 gap-4 overflow-hidden">

          {/* Top Bar */}
          <div className="flex items-center justify-between shrink-0">
            <div>
              <h2 className="text-base font-semibold text-slate-800 dark:text-white/90">
                {isLoading
                  ? '⚔️ Battle in progress…'
                  : hasResult
                  ? '🏆 Battle Complete'
                  : 'New Battle'}
              </h2>
              <p className="text-slate-500 dark:text-white/40 text-xs mt-0.5">
                {isLoading
                  ? 'Mistral & Cohere are generating responses…'
                  : hasResult
                  ? 'Gemini has delivered the verdict.'
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

          {/* Error Banner */}
          <AnimatePresence>
            {error && (
              <ErrorBanner message={error} onDismiss={reset} onRetry={retry} />
            )}
          </AnimatePresence>

          {/* Prompt Input */}
          <div className="shrink-0">
            <PromptInput
              onSubmit={submitProblem}
              isLoading={isLoading}
              onReset={reset}
              hasResult={hasResult}
              models={selectedModels}
            />
          </div>

          {/* Model Selectors */}
          <div className="shrink-0">
            <div className="glass rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-3">Choose Your AI Models</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-slate-600 dark:text-white/60 uppercase tracking-widest">Panel 1</label>
                  <ModelSelector
                    value={selectedModels.modelA}
                    onChange={(value) => setSelectedModels(prev => ({ ...prev, modelA: value }))}
                    disabled={isLoading}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-slate-600 dark:text-white/60 uppercase tracking-widest">Panel 2</label>
                  <ModelSelector
                    value={selectedModels.modelB}
                    onChange={(value) => setSelectedModels(prev => ({ ...prev, modelB: value }))}
                    disabled={isLoading}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-slate-600 dark:text-white/60 uppercase tracking-widest">Judge</label>
                  <ModelSelector
                    value={selectedModels.judgeModel}
                    onChange={(value) => setSelectedModels(prev => ({ ...prev, judgeModel: value }))}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
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
      )}
    </Layout>
  )}
</>);
}
