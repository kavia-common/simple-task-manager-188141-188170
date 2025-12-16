import React, { useEffect, useRef, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * TaskItem renders a single task with actions: toggle complete, inline edit, modal edit, and delete.
 */
export default function TaskItem({ task, onToggle, onDelete, onUpdate }) {
  /** Accessible inline editing with fallback modal for detailed edits. */
  const [isEditing, setIsEditing] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [text, setText] = useState(task.text);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) inputRef.current.focus();
  }, [isEditing]);

  const submitEdit = (e) => {
    if (e) e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) {
      setText(task.text);
      setIsEditing(false);
      setIsModal(false);
      return;
    }
    if (trimmed !== task.text) {
      onUpdate(task.id, { text: trimmed });
    }
    setIsEditing(false);
    setIsModal(false);
  };

  return (
    <>
      <li className="task-item" role="listitem" aria-label={`Task: ${task.text}`}>
        <div className="left">
          <input
            id={`chk-${task.id}`}
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
            aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
          />
          {isEditing ? (
            <form onSubmit={submitEdit} className="inline-edit-form">
              <label htmlFor={`edit-${task.id}`} className="visually-hidden">Edit task</label>
              <input
                id={`edit-${task.id}`}
                ref={inputRef}
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="input inline"
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setText(task.text);
                    setIsEditing(false);
                  }
                }}
              />
            </form>
          ) : (
            <label
              htmlFor={`chk-${task.id}`}
              className={`task-text ${task.completed ? 'completed' : ''}`}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onToggle(task.id);
                }
              }}
            >
              {task.text}
            </label>
          )}
        </div>
        <div className="actions">
          {isEditing ? (
            <>
              <button
                className="btn small success"
                onClick={submitEdit}
                aria-label="Save edit"
              >
                Save
              </button>
              <button
                className="btn small"
                onClick={() => {
                  setText(task.text);
                  setIsEditing(false);
                }}
                aria-label="Cancel edit"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                className="btn small"
                onClick={() => setIsEditing(true)}
                aria-label="Edit task inline"
              >
                Edit
              </button>
              <button
                className="btn small"
                onClick={() => {
                  setIsModal(true);
                  setIsEditing(false);
                  setText(task.text);
                }}
                aria-label="Open edit modal"
              >
                Modal
              </button>
              <button
                className="btn small danger"
                onClick={() => onDelete(task.id)}
                aria-label="Delete task"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </li>

      {isModal && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby={`modal-title-${task.id}`}>
          <div className="modal">
            <h2 id={`modal-title-${task.id}`}>Edit Task</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitEdit();
              }}
            >
              <label htmlFor={`modal-input-${task.id}`} className="label">Task text</label>
              <input
                id={`modal-input-${task.id}`}
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="input"
                autoFocus
              />
              <div className="modal-actions">
                <button type="submit" className="btn success">Save</button>
                <button type="button" className="btn" onClick={() => setIsModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
