import React from 'react';

const SORT_OPTIONS = [
  { id: 'default', label: 'Default (Created)' },
  { id: 'dueDate', label: 'Due date (soonest first)' },
  { id: 'completedLast', label: 'Completed last' },
  { id: 'alphabetical', label: 'Alphabetical' },
];

/**
 * PUBLIC_INTERFACE
 * SortControl renders a dropdown to select task sorting option.
 */
export default function SortControl({ current, onChange }) {
  /** Accessible dropdown for selecting sort order with keyboard support. */
  return (
    <div className="sort-control">
      <label htmlFor="sort-select" className="sort-label">
        Sort by:
      </label>
      <select
        id="sort-select"
        className="sort-select"
        value={current}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Sort tasks by"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
