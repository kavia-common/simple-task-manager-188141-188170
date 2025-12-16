import React from 'react';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
];

/**
 * PUBLIC_INTERFACE
 * Filters renders filter controls to view tasks by status.
 */
export default function Filters({ current, onChange }) {
  /** Renders set of filter buttons with aria-pressed for accessibility. */
  return (
    <div className="filters" role="group" aria-label="Task filters">
      {FILTERS.map((f) => (
        <button
          key={f.id}
          type="button"
          className={`chip ${current === f.id ? 'chip-active' : ''}`}
          aria-pressed={current === f.id}
          onClick={() => onChange(f.id)}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
