import { useState, useCallback, useEffect } from 'react';
import api from '../lib/axios';

export function useArena(user) {
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [lastProblem, setLastProblem] = useState(null);
  const [lastModels, setLastModels] = useState(null);

  const userId = user?._id || user?.id;

  // Load history from backend
  const fetchHistory = useCallback(async () => {
    if (!userId) return;
    try {
      const { data } = await api.get('/history');
      if (data.success) {
        // Map _id to id for frontend compatibility
        const normalized = data.data.map(entry => ({
          ...entry,
          id: entry._id
        }));
        setHistory(normalized);
      }
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  }, [userId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

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

      const resultData = data.data;

      // Sync history after successful invocation (backend saved it)
      fetchHistory();

      setResult(resultData);
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

  const clearHistory = useCallback(async () => {
    try {
      const { data } = await api.delete('/history');
      if (data.success) {
        setHistory([]);
      }
    } catch (err) {
      console.error('Failed to clear history:', err);
    }
  }, []);

  const deleteHistoryItem = useCallback(async (id) => {
    try {
      const { data } = await api.delete(`/history/${id}`);
      if (data.success) {
        setHistory(prev => prev.filter(item => item.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete history item:', err);
    }
  }, []);

  return {
    status,
    result,
    error,
    history,
    submitProblem,
    retry,
    reset,
    loadFromHistory,
    clearHistory,
    deleteHistoryItem,
  };
}
