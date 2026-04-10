import { useState, useCallback } from 'react';
import api from '../lib/axios';

function loadHistory(userId) {
  const HISTORY_KEY = `battle_arena_history_${userId || 'guest'}`;
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveHistory(history, userId) {
  const HISTORY_KEY = `battle_arena_history_${userId || 'guest'}`;
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 30)));
  } catch {}
}

export function useArena(userId) {
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState(() => loadHistory(userId));
  const [lastProblem, setLastProblem] = useState(null);
  const [lastModels, setLastModels] = useState(null);

  const submitProblem = useCallback(async (problem, models = {}) => {
    if (!problem.trim()) return;

    const { modelA = 'mistral', modelB = 'mistral', judgeModel = 'mistral' } = models;

    // Validation
    if (modelA === modelB) {
      setError('Model A and Model B must be different');
      setStatus('error');
      return;
    }
    if (judgeModel === modelA || judgeModel === modelB) {
      setError('Judge model must be different from competing models');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setResult(null);
    setError(null);
    setLastProblem(problem);
    setLastModels(models);

    try {
      const { data } = await api.post('/invoke', {
        input: problem,
        modelA: models.modelA || 'mistral',
        modelB: models.modelB || 'mistral',
        judgeModel: models.judgeModel || 'mistral'
      });

      const entry = {
        id: Date.now(),
        problem,
        timestamp: new Date().toISOString(),
        result: data.data,
        models: models
      };

      const updated = [entry, ...loadHistory(userId)];
      saveHistory(updated, userId);
      setHistory(updated);
      setResult(data.data);
      setStatus('success');
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Something went wrong. Please try again.';
      setError(msg);
      setStatus('error');
    }
  }, []);

  const retry = useCallback(() => {
    if (lastProblem && lastModels) {
      submitProblem(lastProblem, lastModels);
    }
  }, [lastProblem, lastModels, submitProblem]);

  const reset = useCallback(() => {
    setStatus('idle');
    setResult(null);
    setError(null);
  }, []);

  const loadFromHistory = useCallback((entry) => {
    setResult(entry.result);
    setStatus('success');
    setError(null);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    saveHistory([], userId);
  }, [userId]);

  return {
    status,
    result,
    error,
    history,
    submitProblem,    retry,    reset,
    loadFromHistory,
    clearHistory,
  };
}
