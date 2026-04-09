import { useState, useCallback } from 'react';
import api from '../lib/axios';

const HISTORY_KEY = 'battle_arena_history';

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveHistory(history) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 30)));
  } catch {}
}

export function useArena() {
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState(loadHistory);

  const submitProblem = useCallback(async (problem) => {
    if (!problem.trim()) return;

    setStatus('loading');
    setResult(null);
    setError(null);

    try {
      const { data } = await api.post('/invoke', {  input: problem });

      if (!data.success) throw new Error('API returned success: false');

      const entry = {
        id: Date.now(),
        problem,
        timestamp: new Date().toISOString(),
        result: data.data,
      };

      const updated = [entry, ...loadHistory()];
      saveHistory(updated);
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
    saveHistory([]);
  }, []);

  return {
    status,
    result,
    error,
    history,
    submitProblem,
    reset,
    loadFromHistory,
    clearHistory,
  };
}
