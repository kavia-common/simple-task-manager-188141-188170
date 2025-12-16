import React from 'react';

// PUBLIC_INTERFACE
export default function Header() {
  /** Renders the app header with title and subtitle. */
  return (
    <header className="header" role="banner">
      <h1 className="title">Simple Todo</h1>
      <p className="subtitle">Stay organized. Add, complete, edit, and filter your tasks.</p>
    </header>
  );
}
