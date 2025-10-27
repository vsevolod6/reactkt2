import React, { useState, useEffect } from 'react';
import './Notebook.css';

const Notebook = () => {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState('');
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Загрузка заметок из localStorage при загрузке
  useEffect(() => {
    const savedNotes = localStorage.getItem('notebook-notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Сохранение заметок в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('notebook-notes', JSON.stringify(notes));
  }, [notes]);

  // Создание новой заметки
  const createNewNote = () => {
    if (currentNote.trim() !== '') {
      const newNote = {
        id: Date.now(),
        title: currentNote.slice(0, 30) + (currentNote.length > 30 ? '...' : ''),
        content: currentNote,
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString()
      };
      setNotes([newNote, ...notes]);
      setCurrentNote('');
      setSelectedNoteId(newNote.id);
    }
  };

  // Выбор заметки для просмотра/редактирования
  const selectNote = (note) => {
    setCurrentNote(note.content);
    setSelectedNoteId(note.id);
  };

  // Обновление текущей заметки
  const updateCurrentNote = () => {
    if (selectedNoteId && currentNote.trim() !== '') {
      setNotes(notes.map(note =>
        note.id === selectedNoteId
          ? {
              ...note,
              title: currentNote.slice(0, 30) + (currentNote.length > 30 ? '...' : ''),
              content: currentNote,
              updatedAt: new Date().toLocaleString()
            }
          : note
      ));
    }
  };

  // Удаление заметки
  const deleteNote = (id, e) => {
    e.stopPropagation();
    setNotes(notes.filter(note => note.id !== id));
    if (selectedNoteId === id) {
      setCurrentNote('');
      setSelectedNoteId(null);
    }
  };

  // Создание новой пустой заметки
  const createEmptyNote = () => {
    setCurrentNote('');
    setSelectedNoteId(null);
  };

  // Фильтрация заметок по поиску
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="notebook">
      <div className="notebook-header">
        <h1>📓 Мой Блокнот</h1>
        <div className="notes-stats">
          Всего заметок: {notes.length}
        </div>
      </div>

      <div className="notebook-container">
        {/* Боковая панель с заметками */}
        <div className="sidebar">
          <div className="sidebar-header">
            <button 
              onClick={createEmptyNote}
              className="new-note-btn"
              title="Создать новую заметку"
            >
              + Новая заметка
            </button>
            
            <div className="search-container">
              <input
                type="text"
                placeholder="Поиск заметок..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="notes-list">
            {filteredNotes.length === 0 ? (
              <div className="empty-notes">
                {searchTerm ? 'Заметки не найдены' : 'Заметок пока нет'}
              </div>
            ) : (
              filteredNotes.map(note => (
                <div
                  key={note.id}
                  className={`note-item ${selectedNoteId === note.id ? 'active' : ''}`}
                  onClick={() => selectNote(note)}
                >
                  <div className="note-header">
                    <div className="note-title">{note.title}</div>
                    <button
                      onClick={(e) => deleteNote(note.id, e)}
                      className="delete-btn"
                      title="Удалить заметку"
                    >
                      ×
                    </button>
                  </div>
                  <div className="note-date">
                    {note.updatedAt === note.createdAt ? 'Создана: ' : 'Обновлена: '}
                    {note.updatedAt}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Область редактирования */}
        <div className="editor">
          <div className="editor-header">
            {selectedNoteId ? (
              <div className="editor-info">
                <span>Редактирование заметки</span>
                <div className="editor-actions">
                  <button 
                    onClick={updateCurrentNote}
                    className="save-btn"
                    disabled={!currentNote.trim()}
                  >
                    💾 Сохранить
                  </button>
                  <button 
                    onClick={createEmptyNote}
                    className="new-btn"
                  >
                    📄 Новая
                  </button>
                </div>
              </div>
            ) : (
              <div className="editor-info">
                <span>Новая заметка</span>
                <button 
                  onClick={createNewNote}
                  className="save-btn"
                  disabled={!currentNote.trim()}
                >
                  💾 Создать
                </button>
              </div>
            )}
          </div>

          <textarea
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value)}
            placeholder="Начните писать свою заметку здесь..."
            className="note-textarea"
            autoFocus
          />

          <div className="editor-footer">
            <div className="note-counter">
              Символов: {currentNote.length} | Слов: {currentNote.trim() ? currentNote.trim().split(/\s+/).length : 0}
            </div>
            <div className="editor-tips">
              💡 Подсказка: Заметки автоматически сохраняются в вашем браузере
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notebook;
