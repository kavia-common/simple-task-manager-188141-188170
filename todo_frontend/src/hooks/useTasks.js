import { useCallback, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'kavia_todo_tasks_v1';

function loadLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocal(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // ignore quota errors
  }
}

function genId() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * PUBLIC_INTERFACE
 * useTasks manages tasks with persistence to localStorage and optional API sync.
 */
export function useTasks() {
  /** Provides tasks state and CRUD operations with filter support. */
  const API_BASE = process.env.REACT_APP_API_BASE || '';
  const apiEnabled = !!API_BASE;

  const [tasks, setTasks] = useState(() => loadLocal());
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  // Attempt to fetch initial tasks if API is provided. Graceful fallback to local.
  useEffect(() => {
    let isMounted = true;
    async function fetchTasks() {
      if (!apiEnabled) return;
      setLoading(true);
      try {
        const res = await fetch(`${baseUrl}/tasks`);
        if (!res.ok) throw new Error('Non-OK');
        const data = await res.json();
        if (isMounted && Array.isArray(data)) {
          setTasks(data);
          saveLocal(data);
        }
      } catch {
        // Fallback: keep local
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchTasks();
    return () => { isMounted = false; };
  }, [baseUrl, apiEnabled]);

  // Persist to localStorage whenever tasks change
  useEffect(() => {
    saveLocal(tasks);
  }, [tasks]);

  const filtered = useMemo(() => {
    switch (filter) {
      case 'active': return tasks.filter(t => !t.completed);
      case 'completed': return tasks.filter(t => t.completed);
      default: return tasks;
    }
  }, [tasks, filter]);

  // CRUD operations
  // Helper to safely build URLs by trimming a single trailing slash
  const baseUrl = API_BASE ? API_BASE.replace(/\/$/, '') : '';

  const addTask = useCallback(async (text) => {
    const newTask = { id: genId(), text, completed: false };
    setTasks(prev => [newTask, ...prev]);

    if (apiEnabled) {
      try {
        await fetch(`${baseUrl}/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTask),
        });
      } catch {
        // ignore API failures; local already updated
      }
    }
  }, [baseUrl, apiEnabled]);

  const toggleTask = useCallback(async (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    if (apiEnabled) {
      try {
        await fetch(`${baseUrl}/tasks/${id}/toggle`, { method: 'PATCH' });
      } catch {
        // ignore
      }
    }
  }, [baseUrl, apiEnabled]);

  const deleteTask = useCallback(async (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    if (apiEnabled) {
      try {
        await fetch(`${baseUrl}/tasks/${id}`, { method: 'DELETE' });
      } catch {
        // ignore
      }
    }
  }, [baseUrl, apiEnabled]);

  const updateTask = useCallback(async (id, updates) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    if (apiEnabled) {
      try {
        await fetch(`${baseUrl}/tasks/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
      } catch {
        // ignore
      }
    }
  }, [baseUrl, apiEnabled]);

  return {
    tasks,
    filtered,
    filter,
    setFilter,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    loading,
    apiEnabled,
  };
}
