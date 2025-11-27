import React from 'react';

// PUBLIC_INTERFACE
export default function TopNav({ onNewNote, theme, onToggleTheme }) {
  /** Top navigation bar with app title, New Note button, and theme toggle */
  return (
    <nav className="topnav">
      <div className="brand">
        <span className="logo">📝</span>
        <span className="title">Ocean Notes</span>
      </div>
      <div className="actions">
        <button className="btn btn-primary" onClick={onNewNote} aria-label="Create new note">
          + New Note
        </button>
        <button
          className="btn btn-secondary theme-toggle-inline"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>
    </nav>
  );
}
