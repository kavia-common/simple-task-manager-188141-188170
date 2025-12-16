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
 * Format date for display in a readable format
 */
function formatDueDate(isoString) {
  if (!isoString) return null;
  const date = new Date(isoString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  const diffTime = dueDay - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Get due date status: 'overdue', 'due-soon' (within 24h), or null
 */
function getDueDateStatus(isoString) {
  if (!isoString) return null;
  const dueDate = new Date(isoString);
  const now = new Date();
  const diffMs = dueDate - now;
  const diffHours = diffMs / (1000 * 60 * 60);
  
  if (diffHours < 0) return 'overdue';
  if (diffHours <= 24) return 'due-soon';
  return null;
}

/**
 * Convert ISO string to date input format (YYYY-MM-DD)
 */
function toDateInputValue(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * PUBLIC_INTERFACE
 * TaskItem renders a single task with actions: toggle complete, inline edit, modal edit, delete, and due date display/edit.
 */
export default function TaskItem({ task, animationState = 'entered', onToggle, onDelete, onUpdate }) {
  /** Accessible inline editing with due date support, fallback modal for detailed edits, and icon-based actions. */
  const [isEditing, setIsEditing] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [text, setText] = useState(task.text);
  const [dueDate, setDueDate] = useState(toDateInputValue(task.dueDate));
  const inputRef = useRef(null);

  const dueDateStatus = getDueDateStatus(task.dueDate);
  const formattedDueDate = formatDueDate(task.dueDate);

  useEffect(() => {
    if (isEditing && inputRef.current) inputRef.current.focus();
  }, [isEditing]);

  const submitEdit = (e) => {
    if (e) e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) {
      setText(task.text);
      setDueDate(toDateInputValue(task.dueDate));
      setIsEditing(false);
      setIsModal(false);
      return;
    }
    
    const updates = {};
    if (trimmed !== task.text) {
      updates.text = trimmed;
    }
    
    // Convert date input value to ISO string or null
    const newDueDateISO = dueDate ? new Date(dueDate).toISOString() : null;
    const currentDueDate = task.dueDate || null;
    
    if (newDueDateISO !== currentDueDate) {
      updates.dueDate = newDueDateISO;
    }
    
    if (Object.keys(updates).length > 0) {
      onUpdate(task.id, updates);
    }
    
    setIsEditing(false);
    setIsModal(false);
  };

  return (
    <>
      <li 
        className="task-item" 
        data-animation-state={animationState}
        role="listitem" 
        aria-label={`Task: ${task.text}${formattedDueDate ? `, Due: ${formattedDueDate}` : ''}`}
      >
        <div className="left">
          <input
            id={`chk-${task.id}`}
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
            aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
          />
          <div className="task-content">
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
                      setDueDate(toDateInputValue(task.dueDate));
                      setIsEditing(false);
                    }
                  }}
                />
                <label htmlFor={`edit-date-${task.id}`} className="visually-hidden">Edit due date</label>
                <input
                  id={`edit-date-${task.id}`}
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="input inline date-input-inline"
                  aria-label="Edit due date"
                />
              </form>
            ) : (
              <>
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
                {formattedDueDate && (
                  <div className={`due-date ${dueDateStatus || ''}`} aria-label={`Due date: ${formattedDueDate}`}>
                    {dueDateStatus === 'overdue' && <span className="due-indicator overdue-indicator" aria-hidden="true">●</span>}
                    {dueDateStatus === 'due-soon' && <span className="due-indicator due-soon-indicator" aria-hidden="true">●</span>}
                    <span className="due-date-text">{formattedDueDate}</span>
                  </div>
                )}
              </>
            )}
          </div>
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
                  setDueDate(toDateInputValue(task.dueDate));
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
                  setDueDate(toDateInputValue(task.dueDate));
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
              
              <label htmlFor={`modal-date-${task.id}`} className="label">Due date (optional)</label>
              <input
                id={`modal-date-${task.id}`}
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="input"
                aria-label="Set due date"
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
