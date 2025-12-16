import { useCallback, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'kavia_todo_tasks_v1';
const SORT_KEY = 'kavia_todo_sort_v1';

/**
 * Returns a safe API base URL if provided via env; otherwise an empty string.
 * Trims a single trailing slash to make path joining predictable.
 */
function getBaseUrl() {
  const raw = process.env.REACT_APP_API_BASE || '';
  return raw ? raw.replace(/\/$/, '') : '';
}

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

function loadSort() {
  try {
    const raw = localStorage.getItem(SORT_KEY);
    return raw || 'default';
  } catch {
    return 'default';
  }
}

function saveSort(sortOption) {
  try {
    localStorage.setItem(SORT_KEY, sortOption);
  } catch {
    // ignore quota errors
  }
}

function genId() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Sorts tasks based on the selected sort option.
 * Applied after filtering to maintain filter integrity.
 */
function sortTasks(tasks, sortOption) {
  const sorted = [...tasks];
  
  switch (sortOption) {
    case 'dueDate':
      // Sort by due date (soonest first), tasks without due dates go to end
      return sorted.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    
    case 'completedLast':
      // Incomplete tasks first, then completed
      return sorted.sort((a, b) => {
        if (a.completed === b.completed) return 0;
        return a.completed ? 1 : -1;
      });
    
    case 'alphabetical':
      // Sort alphabetically by text (case-insensitive)
      return sorted.sort((a, b) => 
        a.text.toLowerCase().localeCompare(b.text.toLowerCase())
      );
    
    case 'default':
    default:
      // Default: maintain creation order (newest first as added to beginning)
      return sorted;
  }
}

/**
 * PUBLIC_INTERFACE
 * useTasks manages tasks with persistence to localStorage and optional API sync.
 * Now supports optional dueDate field and sorting options.
 */
export function useTasks() {
  /** Provides tasks state and CRUD operations with filter and sort support. */
  const apiEnabled = !!getBaseUrl();

  const [tasks, setTasks] = useState(() => loadLocal());
  const [filter, setFilter] = useState('all');
  const [sortOption, setSortOption] = useState(() => loadSort());
  const [loading, setLoading] = useState(false);

  // Attempt to fetch initial tasks if API is provided. Graceful fallback to local.
  useEffect(() => {
    let isMounted = true;
    async function fetchTasks() {
      const baseUrl = getBaseUrl();
      if (!baseUrl) return;
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
  }, [apiEnabled]);

  // Persist to localStorage whenever tasks change
  useEffect(() => {
    saveLocal(tasks);
  }, [tasks]);

  // Persist sort option to localStorage
  useEffect(() => {
    saveSort(sortOption);
  }, [sortOption]);

  const filtered = useMemo(() => {
    let result;
    switch (filter) {
      case 'active': 
        result = tasks.filter(t => !t.completed);
        break;
      case 'completed': 
        result = tasks.filter(t => t.completed);
        break;
      default: 
        result = tasks;
    }
    // Apply sorting after filtering
    return sortTasks(result, sortOption);
  }, [tasks, filter, sortOption]);

  // CRUD operations use getBaseUrl lazily to avoid TDZ and always read latest env at runtime.
  // Extended to support optional dueDate field.
  const addTask = useCallback(async (text, dueDate = null) => {
    const newTask = { 
      id: genId(), 
      text, 
      completed: false,
      ...(dueDate && { dueDate })
    };
    setTasks(prev => [newTask, ...prev]);

    const baseUrl = getBaseUrl();
    if (baseUrl) {
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
  }, []);

  const toggleTask = useCallback(async (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));

    const baseUrl = getBaseUrl();
    if (baseUrl) {
      try {
        await fetch(`${baseUrl}/tasks/${id}/toggle`, { method: 'PATCH' });
      } catch {
        // ignore
      }
    }
  }, []);

  const deleteTask = useCallback(async (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));

    const baseUrl = getBaseUrl();
    if (baseUrl) {
      try {
        await fetch(`${baseUrl}/tasks/${id}`, { method: 'DELETE' });
      } catch {
        // ignore
      }
    }
  }, []);

  const updateTask = useCallback(async (id, updates) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));

    const baseUrl = getBaseUrl();
    if (baseUrl) {
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
  }, []);

  return {
    tasks,
    filtered,
    filter,
    setFilter,
    sortOption,
    setSortOption,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    loading,
    apiEnabled,
  };
}
