import React, { useEffect, useState } from 'react';

// PUBLIC_INTERFACE
export default function NoteEditorModal({ isOpen, note, onClose, onSave }) {
  /**
   * Modal with title/content fields; Save/Cancel; supports create and edit via props.
   * - note: existing note object for edit, or null/undefined for create
   */
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');

  useEffect(() => {
    setTitle(note?.title || '');
    setContent(note?.content || '');
  }, [note, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave && onSave({
      ...note,
      title: title.trim() || 'Untitled',
      content,
    });
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modal-header">
          <h3>{note?.id ? 'Edit Note' : 'New Note'}</h3>
        </div>
        <div className="modal-body">
          <label className="field">
            <span className="field-label">Title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title"
            />
          </label>
          <label className="field">
            <span className="field-label">Content</span>
            <textarea
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your thoughts..."
            />
          </label>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}
