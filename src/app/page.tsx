"use client";

import React, { useState, useEffect } from 'react';
import Note from '../components/Note';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const Home: React.FC = () => {
  interface Note {
    id: string;
    title: string;
    content: string;
    language: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchNotes = async () => {
      const querySnapshot = await getDocs(collection(db, 'notes'));
      const notesData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          content: data.content,
          language: data.language,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        };
      });
      setNotes(notesData);
    };

    fetchNotes();
  }, []);

  const addNote = async () => {
    await addDoc(collection(db, 'notes'), {
      title,
      content,
      language,
      createdAt: new Date(),
    });
    setTitle('');
    setContent('');
    setLanguage('');
  };

  const updateNote = async (id: string, newTitle: string, newContent: string, newLanguage: string) => {
    const noteRef = doc(db, 'notes', id);
    await updateDoc(noteRef, {
      title: newTitle,
      content: newContent,
      language: newLanguage,
      updatedAt: new Date(),
    });
  };

  const deleteNote = async (id: string) => {
    const noteRef = doc(db, 'notes', id);
    await deleteDoc(noteRef);
  };

  const searchNotes = (query: string) => {
    return notes.filter(note => note.title.includes(query) || note.content.includes(query));
  };

  const filteredNotes = searchQuery ? searchNotes(searchQuery) : notes;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Language Learning Notes</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded"
        />
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded mb-2"
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-2 rounded mb-2"
        />
        <input
          type="text"
          placeholder="Language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border p-2 rounded mb-2"
        />
        <button onClick={addNote} className="bg-blue-500 text-white p-2 rounded">Add Note</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNotes.map(note => (
          <Note key={note.id} note={note} />
        ))}
      </div>
    </div>
  );
};

export default Home;
