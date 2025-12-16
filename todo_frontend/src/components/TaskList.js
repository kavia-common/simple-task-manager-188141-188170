import React, { useEffect, useState } from 'react';
import TaskItem from './TaskItem';

/**
 * PUBLIC_INTERFACE
 * TaskList renders a scrollable list of tasks based on the current filter with enter/exit animations.
 */
export default function TaskList({ tasks, onToggle, onDelete, onUpdate }) {
  /** Displays list of TaskItem components with smooth animations and enhanced empty state. */
  const [taskStates, setTaskStates] = useState({});

  // Track task lifecycle for animations
  useEffect(() => {
    const newStates = {};
    tasks.forEach(task => {
      if (!taskStates[task.id]) {
        // New task - mark as entering
        newStates[task.id] = 'entering';
      } else if (taskStates[task.id] === 'entering') {
        // Already entered
        newStates[task.id] = 'entered';
      } else {
        // Keep existing state
        newStates[task.id] = taskStates[task.id];
      }
    });

    // Mark removed tasks as exiting
    Object.keys(taskStates).forEach(id => {
      if (!tasks.find(t => t.id === id) && taskStates[id] !== 'exiting') {
        newStates[id] = 'exiting';
      }
    });

    setTaskStates(newStates);
  }, [tasks]);

  // Trigger entered state after mount
  useEffect(() => {
    const enteringIds = Object.keys(taskStates).filter(id => taskStates[id] === 'entering');
    if (enteringIds.length > 0) {
      const timer = setTimeout(() => {
        setTaskStates(prev => {
          const updated = { ...prev };
          enteringIds.forEach(id => {
            if (updated[id] === 'entering') {
              updated[id] = 'entered';
            }
          });
          return updated;
        });
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [taskStates]);

  // Handle wrapped delete for exit animation
  const handleDelete = (id) => {
    setTaskStates(prev => ({ ...prev, [id]: 'exiting' }));
    // Delay actual delete to allow animation
    setTimeout(() => {
      onDelete(id);
      setTaskStates(prev => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    }, 300); // Match CSS animation duration
  };

  if (!tasks.length) {
    return (
      <div className="empty" role="status" aria-live="polite">
        <svg 
          className="empty-icon" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" 
          />
        </svg>
        <div>
          <h3 className="empty-title">No tasks yet</h3>
          <p className="empty-text">Stay organized and productive</p>
          <p className="empty-cta">👆 Add your first task above to get started</p>
        </div>
      </div>
    );
  }
  
  return (
    <ul className="task-list" role="list">
      {tasks.map((t) => (
        <TaskItem
          key={t.id}
          task={t}
          animationState={taskStates[t.id] || 'entered'}
          onToggle={onToggle}
          onDelete={handleDelete}
          onUpdate={onUpdate}
        />
      ))}
    </ul>
  );
}
