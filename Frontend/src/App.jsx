import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import ArenaPage from './pages/ArenaPage';
import ProfilePage from './pages/ProfilePage';
import { AppLoader } from './components/common/Feedback';
import api from './lib/axios';
import { useArena } from './hooks/useArena';

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

  const { 
    status, result, error, history, 
    submitProblem, retry, reset, 
    loadFromHistory, clearHistory, deleteHistoryItem 
  } = useArena(user);

  // Persistence
  useEffect(() => {
    localStorage.setItem('selectedModels', JSON.stringify(selectedModels));
  }, [selectedModels]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsAppLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Theme Sync
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [darkMode]);

  // Auth Handlers
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
      const response = await api.post('/auth/verify-otp', { email: verificationEmail, otp });
      completeAuth(response.data.token, response.data.user);
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
      setVerificationMessage(response.data.message || 'A new code has been sent.');
    } catch (err) {
      setVerificationMessage(err.response?.data?.error || err.message || 'Failed to resend');
    } finally {
      setResendLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setCurrentView('battle');
    reset();
  };

  // View Handlers
  const onProfile = () => setCurrentView('profile');
  const onNewBattle = () => {
    setCurrentView('battle');
    reset();
  };

  if (isAppLoading) return <AppLoader />;

  return (
    <>
      {!entryCompleted ? (
        <LandingPage onEnter={() => setEntryCompleted(true)} />
      ) : !isAuthenticated ? (
        <AuthPage 
          view={authView}
          onLogin={handleLogin}
          onRegister={handleRegister}
          onRequireVerification={handleRequireVerification}
          onSwitchView={setAuthView}
          verificationEmail={verificationEmail}
          verificationMessage={verificationMessage}
          onVerifyEmail={handleVerifyEmail}
          onResendOtp={handleResendOtp}
          onCancelVerification={() => setAuthView('login')}
          isSubmitting={verificationLoading}
          isResending={resendLoading}
        />
      ) : (
        <Layout
          history={history}
          onSelectHistory={loadFromHistory}
          onClearHistory={clearHistory}
          onDeleteHistory={deleteHistoryItem}
          darkMode={darkMode}
          onToggleDark={() => setDarkMode(!darkMode)}
          onNewBattle={onNewBattle}
          onProfile={onProfile}
          user={user}
          onLogout={handleLogout}
        >
          {currentView === 'profile' ? (
            <ProfilePage onBack={() => setCurrentView('battle')} />
          ) : (
            <ArenaPage 
              status={status}
              result={result}
              error={error}
              selectedModels={selectedModels}
              setSelectedModels={setSelectedModels}
              submitProblem={submitProblem}
              reset={reset}
              retry={retry}
              isLoading={status === 'loading'}
              hasResult={status === 'success'}
            />
          )}
        </Layout>
      )}
    </>
  );
}
