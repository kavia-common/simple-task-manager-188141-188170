import React, { useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * TaskInput provides an accessible form to add a new task with optional due date.
 */
export default function TaskInput({ onAdd }) {
  /** Renders input, optional date picker, and button for creating a task. */
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    
    // Pass dueDate as ISO string if provided, otherwise null
    const dueDateValue = dueDate ? new Date(dueDate).toISOString() : null;
    onAdd(trimmed, dueDateValue);
    
    setText('');
    setDueDate('');
  };

  return (
    <form className="task-input" onSubmit={submit} aria-label="Add new task form">
      <div className="task-input-fields">
        <div className="input-group">
          <label htmlFor="new-task" className="visually-hidden">New task</label>
          <input
            id="new-task"
            name="new-task"
            type="text"
            placeholder="What do you need to do?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            aria-required="true"
            className="input"
          />
        </div>
        <div className="input-group date-input-group">
          <label htmlFor="new-task-due-date" className="date-label">
            Due date (optional):
          </label>
          <input
            id="new-task-due-date"
            name="new-task-due-date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="input date-input"
            aria-label="Set due date for new task"
          />
        </div>
      </div>
      <button type="submit" className="btn primary" aria-label="Add task">
        Add
      </button>
    </form>
  );
}
