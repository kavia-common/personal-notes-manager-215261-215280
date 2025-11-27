import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import './index.css';
import TopNav from './components/TopNav';
import NotesList from './components/NotesList';
import NoteEditorModal from './components/NoteEditorModal';
import { getNotes, createNote, updateNote, deleteNote, health } from './api/client';

// PUBLIC_INTERFACE
function App() {
  /** Root app: manages theme, loads notes, performs optimistic CRUD and shows UI */
  const [theme, setTheme] = useState('light');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Initial load
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // Optional health check (non-fatal)
        try { await health(); } catch { /* ignore */ }

        const data = await getNotes({});
        if (!alive) return;
        // normalize to array shape
        const list = Array.isArray(data) ? data : (data?.items || []);
        setNotes(list);
      } catch (e) {
        console.error(e);
        setError(e?.message || 'Failed to load notes');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const onNewNote = () => {
    setEditingNote(null);
    setModalOpen(true);
  };

  const onToggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const onSelectNote = (note) => {
    setEditingNote(note);
    setModalOpen(true);
  };

  const onDeleteNote = async (note) => {
    const prev = notes;
    setNotes(prev.filter(n => n.id !== note.id));
    try {
      await deleteNote(note.id);
      toast('Note deleted', 'success');
    } catch (e) {
      console.error(e);
      setNotes(prev); // rollback
      toast(e?.message || 'Failed to delete note', 'error');
    }
  };

  const onSaveNote = async (notePayload) => {
    if (editingNote?.id) {
      // update existing
      const id = editingNote.id;
      const optimistic = notes.map(n => n.id === id ? { ...n, ...notePayload, id } : n);
      const prev = notes;
      setNotes(optimistic);
      setModalOpen(false);
      try {
        const saved = await updateNote(id, { title: notePayload.title, content: notePayload.content });
        setNotes(prevList => prevList.map(n => n.id === id ? { ...n, ...saved } : n));
        toast('Note updated', 'success');
      } catch (e) {
        console.error(e);
        setNotes(prev);
        toast(e?.message || 'Failed to update note', 'error');
      }
    } else {
      // create
      const tempId = `tmp_${Date.now()}`;
      const temp = { id: tempId, title: notePayload.title, content: notePayload.content, updated_at: new Date().toISOString() };
      const prev = notes;
      setNotes([temp, ...prev]);
      setModalOpen(false);
      try {
        const created = await createNote({ title: notePayload.title, content: notePayload.content });
        setNotes(current => current.map(n => n.id === tempId ? created : n));
        toast('Note created', 'success');
      } catch (e) {
        console.error(e);
        setNotes(prev);
        toast(e?.message || 'Failed to create note', 'error');
      }
    }
  };

  const toast = (message, type = 'info') => {
    // basic alert based on type; can be replaced by toast lib
    if (type === 'error') {
      window.alert(`❌ ${message}`);
    } else if (type === 'success') {
      // be less intrusive for success
      console.log(`✅ ${message}`);
    } else {
      console.log(message);
    }
  };

  const content = useMemo(() => {
    if (loading) {
      return <div className="state state-loading">Loading notes...</div>;
    }
    if (error) {
      return <div className="state state-error">Error: {error}</div>;
    }
    return (
      <NotesList
        notes={notes}
        onSelect={onSelectNote}
        onDelete={onDeleteNote}
      />
    );
  }, [loading, error, notes]);

  return (
    <div className="App">
      <TopNav onNewNote={onNewNote} theme={theme} onToggleTheme={onToggleTheme} />
      <main className="main">
        {content}
      </main>

      <NoteEditorModal
        isOpen={modalOpen}
        note={editingNote}
        onClose={() => setModalOpen(false)}
        onSave={onSaveNote}
      />
    </div>
  );
}

export default App;
