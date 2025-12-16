import React, { useEffect, useRef, useState } from 'react';

// Icon components for actions
const EditIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const DeleteIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const SaveIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const CancelIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

/**
 * PUBLIC_INTERFACE
 * TaskItem renders a single task with actions: toggle complete, inline edit, modal edit, and delete.
 */
export default function TaskItem({ task, onToggle, onDelete, onUpdate }) {
  /** Accessible inline editing with fallback modal for detailed edits and icon-based actions. */
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
                title="Save"
              >
                <SaveIcon />
                Save
              </button>
              <button
                className="btn small"
                onClick={() => {
                  setText(task.text);
                  setIsEditing(false);
                }}
                aria-label="Cancel edit"
                title="Cancel"
              >
                <CancelIcon />
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                className="btn small"
                onClick={() => setIsEditing(true)}
                aria-label="Edit task inline"
                title="Edit inline"
              >
                <EditIcon />
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
                title="Edit in modal"
              >
                Modal
              </button>
              <button
                className="btn small danger"
                onClick={() => onDelete(task.id)}
                aria-label="Delete task"
                title="Delete"
              >
                <DeleteIcon />
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
