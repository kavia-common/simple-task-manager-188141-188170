import React, { useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * TaskInput provides an accessible form to add a new task.
 */
export default function TaskInput({ onAdd }) {
  /** Renders input and button for creating a task. */
  const [text, setText] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setText('');
  };

  return (
    <form className="task-input" onSubmit={submit} aria-label="Add new task form">
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
      <button type="submit" className="btn primary" aria-label="Add task">
        Add
      </button>
    </form>
  );
}
