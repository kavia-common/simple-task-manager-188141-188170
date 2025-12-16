import React, { useEffect, useState } from 'react';
import './App.css';
import './todo.css';
import Header from './components/Header';
import TaskInput from './components/TaskInput';
import Filters from './components/Filters';
import TaskList from './components/TaskList';
import { useTasks } from './hooks/useTasks';

// PUBLIC_INTERFACE
export default function App() {
  /** Root app: handles theme, composes UI, and wires state via useTasks. */
  const [theme, setTheme] = useState('light');
  const {
    filtered,
    filter,
    setFilter,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    loading,
    apiEnabled,
  } = useTasks();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return (
    <div className="App">
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>

      <main className="container" role="main">
        <Header />
        <section className="panel" aria-labelledby="task-input-title">
          <h2 id="task-input-title" className="visually-hidden">Add task</h2>
          <TaskInput onAdd={addTask} />
          <Filters current={filter} onChange={setFilter} />
        </section>

        <section className="panel list-panel" aria-labelledby="task-list-title">
          <div className="list-header">
            <h2 id="task-list-title">Your tasks</h2>
            <div className="status">
              {loading && <span className="status-badge">Syncing…</span>}
              {!apiEnabled && <span className="status-badge muted" title="Using local storage">Local</span>}
              {apiEnabled && !loading && <span className="status-badge success" title="Connected to API">API</span>}
            </div>
          </div>
          <TaskList
            tasks={filtered}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onUpdate={updateTask}
          />
        </section>
      </main>
    </div>
  );
}
