import React from 'react';
import TaskItem from './TaskItem';

/**
 * PUBLIC_INTERFACE
 * TaskList renders a scrollable list of tasks based on the current filter.
 */
export default function TaskList({ tasks, onToggle, onDelete, onUpdate }) {
  /** Displays list of TaskItem components with enhanced empty state. */
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
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </ul>
  );
}
