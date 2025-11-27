import React, { useMemo, useState } from 'react';

// PUBLIC_INTERFACE
export default function NotesList({ notes, onSelect, onDelete }) {
  /** Notes list with search filter; shows title and updated_at, click to edit, delete with confirm */
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes || [];
    return (notes || []).filter(n => {
      const t = (n.title || '').toLowerCase();
      const c = (n.content || '').toLowerCase();
      return t.includes(q) || c.includes(q);
    });
  }, [notes, query]);

  return (
    <div className="notes-list">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search notes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search notes"
        />
      </div>
      <ul className="list">
        {filtered.length === 0 && (
          <li className="empty">No notes found. Try creating a new one!</li>
        )}
        {filtered.map((note) => (
          <li key={note.id} className="note-item">
            <button className="note-main" onClick={() => onSelect && onSelect(note)}>
              <div className="note-title">{note.title || 'Untitled'}</div>
              <div className="note-meta">
                {note.updated_at ? new Date(note.updated_at).toLocaleString() : ''}
              </div>
            </button>
            <button
              className="btn btn-danger btn-small"
              onClick={() => {
                if (window.confirm('Delete this note? This action cannot be undone.')) {
                  onDelete && onDelete(note);
                }
              }}
              aria-label={`Delete note ${note.title || ''}`}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
