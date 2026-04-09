import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../lib/axios';
import Toast from './Toast';

function UserCard({ user }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200 dark:border-white/10 hover:shadow-xl transition-shadow duration-200"
    >
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-2xl shadow-lg">
          {user?.avatar || '👤'}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-slate-800 dark:text-white">{user?.name || 'User'}</h3>
          <p className="text-slate-500 dark:text-white/60">{user?.email || 'user@example.com'}</p>
          {user?.plan && (
            <div className="mt-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                user.plan === 'pro' ? 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300' :
                user.plan === 'premium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
                'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
              }`}>
                {user.plan === 'free' ? 'Free User' : `${user.plan.charAt(0).toUpperCase() + user.plan.slice(1)} User`}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function UsageLimit({ usage, onUpgrade }) {
  const maxUses = 5;
  const remaining = maxUses - (usage?.used || 0);
  const percentage = ((usage?.used || 0) / maxUses) * 100;
  const isLimitReached = remaining <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200 dark:border-white/10 hover:shadow-xl transition-shadow duration-200"
    >
      <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Usage Limit</h4>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600 dark:text-white/60">Remaining Uses</span>
          <span className="text-sm font-medium text-slate-800 dark:text-white">{remaining} / {maxUses}</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              isLimitReached ? 'bg-red-500' : percentage > 80 ? 'bg-amber-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        {isLimitReached && (
          <div className="text-center">
            <p className="text-sm text-red-600 dark:text-red-400 mb-3">You've reached your free usage limit.</p>
            <button
              onClick={onUpgrade}
              className="w-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-xl transition-all duration-200 shadow-md"
            >
              Upgrade Plan
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function PlanCard({ plan, isCurrent, onUpgrade, isLoading }) {
  const isPopular = plan.name === 'Pro';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
      className={`relative bg-white dark:bg-slate-800/50 rounded-2xl p-6 shadow-lg border transition-all duration-200 ${
        isCurrent
          ? 'border-violet-300 dark:border-violet-600 shadow-violet-200/50 dark:shadow-violet-900/50'
          : 'border-slate-200 dark:border-white/10 shadow-slate-200/50 dark:shadow-slate-900/50 hover:shadow-xl'
      }`}
    >
      {isPopular && !isCurrent && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            Most Popular
          </span>
        </div>
      )}
      {isCurrent && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-green-400 to-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            Current Plan
          </span>
        </div>
      )}
      <div className="text-center">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">{plan.name}</h3>
        <div className="mt-2 mb-4">
          <span className="text-3xl font-bold text-slate-800 dark:text-white">${plan.price}</span>
          <span className="text-slate-500 dark:text-white/60">/month</span>
        </div>
        <ul className="text-sm text-slate-600 dark:text-white/70 space-y-2 mb-6">
          {(plan.features || []).map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              {feature}
            </li>
          ))}
        </ul>
        {!isCurrent && (
          <button
            onClick={() => onUpgrade(plan.id)}
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-xl font-medium transition-all duration-200 ${
              isLoading
                ? 'bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg'
            }`}
          >
            {isLoading ? 'Upgrading...' : 'Upgrade'}
          </button>
        )}
      </div>
    </motion.div>
  );
}

function PlansSection({ plans, currentPlan, onUpgrade, isLoading }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-200 dark:border-white/10 hover:shadow-xl transition-shadow duration-200"
    >
      <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Plans</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isCurrent={currentPlan === plan.id}
            onUpgrade={onUpgrade}
            isLoading={isLoading}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default function UserProfile({ onBack }) {
  const [user, setUser] = useState(null);
  const [usage, setUsage] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [upgrading, setUpgrading] = useState(false);
  const [toast, setToast] = useState(null);
  const [upgradeHint, setUpgradeHint] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [userRes, usageRes, plansRes] = await Promise.all([
        api.get('/user/profile'),
        api.get('/user/usage'),
        api.get('/plans')
      ]);
      setUser(userRes.data);
      setUsage(usageRes.data);
      setPlans(plansRes.data);
    } catch (err) {
      setError('Failed to load profile data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planId) => {
    setUpgradeHint('Experimental mode: this upgrade is simulated and free.');
    setToast({ message: 'Upgrade initiated — experimental mode is active.', type: 'info' });

    try {
      setUpgrading(true);
      await api.post('/upgrade', { planId });
      // Refresh data after upgrade
      await fetchData();
      setToast({ message: 'Plan upgraded successfully!', type: 'success' });
    } catch (err) {
      setToast({ message: 'Failed to upgrade plan. Please try again.', type: 'error' });
      console.error(err);
    } finally {
      setUpgrading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6">
        <div className="w-full max-w-4xl">
          <div className="flex items-center justify-between gap-4 mb-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Battle
            </button>
            <button
              disabled
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 text-white font-medium shadow-md shadow-violet-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Reloading
            </button>
          </div>
        </div>

        <div className="w-full max-w-2xl bg-white dark:bg-slate-800/50 rounded-3xl p-8 shadow-lg shadow-slate-200/30 dark:shadow-slate-900/40 border border-slate-200 dark:border-white/10">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-14 h-14 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
            <div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Loading Profile</h2>
              <p className="text-sm text-slate-500 dark:text-white/60">Fetching your latest profile, plan, and usage data. The reload button remains visible so the UI feels stable.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Battle
        </button>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">User Profile</h1>
        <div></div> {/* Spacer */}
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <UserCard user={user} />
        <UsageLimit usage={usage} onUpgrade={() => handleUpgrade(plans.find(p => p.name === 'Pro')?.id)} />
        {upgradeHint && (
          <div className="rounded-2xl border border-amber-200/80 bg-amber-50/80 p-4 text-sm text-amber-700 dark:border-amber-500/40 dark:bg-amber-950/30 dark:text-amber-300">
            {upgradeHint}
          </div>
        )}
        <PlansSection
          plans={plans}
          currentPlan={user?.plan}
          onUpgrade={handleUpgrade}
          isLoading={upgrading}
        />
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}