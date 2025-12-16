import React from 'react';
import TaskItem from './TaskItem';

/**
 * PUBLIC_INTERFACE
 * TaskList renders a scrollable list of tasks based on the current filter.
 */
export default function TaskList({ tasks, onToggle, onDelete, onUpdate }) {
  /** Displays list of TaskItem components. */
  if (!tasks.length) {
    return <div className="empty">No tasks yet. Add your first task above.</div>;
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
