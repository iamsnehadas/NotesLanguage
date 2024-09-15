"use client";
import React, { useState, useEffect } from 'react';
import Note from '../components/Note';
import { collection, onSnapshot, addDoc, /*updateDoc,*/ deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useUser } from '@clerk/nextjs';

const Home: React.FC = () => {
  const { user } = useUser();
  interface Note {
    id: string;
    title: string;
    content: string;
    language: string;
    userId: string;
    createdAt: Date;
    updatedAt?: Date;
  }
  
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);

  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(collection(db, 'notes'), (snapshot) => {
        const notesData = snapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title,
          content: doc.data().content,
          language: doc.data().language,
          userId: doc.data().userId,
          createdAt: doc.data().createdAt.toDate(),
          updatedAt: doc.data().updatedAt ? doc.data().updatedAt.toDate() : undefined,
        }));
        setNotes(notesData);
        setFilteredNotes(notesData);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const addNote = async () => {
    if (user) {
      await addDoc(collection(db, 'notes'), {
        title,
        content,
        language,
        userId: user.id,
        createdAt: new Date(),
      });
      setTitle('');
      setContent('');
      setLanguage('');
    }
  };

/*
  const updateNote = async (id: string, newTitle: string, newContent: string, newLanguage: string) => {
    const noteRef = doc(db, 'notes', id);
    await updateDoc(noteRef, {
      title: newTitle,
      content: newContent,
      language: newLanguage,
      updatedAt: new Date(),
    });
  };
*/

  const deleteNote = async (id: string) => {
    const noteRef = doc(db, 'notes', id);
    await deleteDoc(noteRef);
  };

  const searchNotes = () => {
    const filtered = notes.filter(note => 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.language.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredNotes(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="Intro text-4xl font-bold text-center mb-8 text-blue-600">Welcome to LearnNote</h1>
        <h2 className='description'>Your very own notesmaker for learning new languages.</h2>
        <div className="mb-6 flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={searchNotes}
            className="bg-purple-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Search
          </button>
        </div>
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="col-span-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addNote}
            className="abutton col-span-2 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Add Note
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredNotes.map(note => (
            <Note key={note.id} note={note} onDelete={deleteNote} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
