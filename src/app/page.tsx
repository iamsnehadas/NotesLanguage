import React, { useState } from 'react';
import Note from '../components/Note';

const Home: React.FC = () => {
  const [notes, setNotes] = useState([
    { id: 1, title: 'Spanish Vocabulary', content: 'Hola, Adiós, Gracias' },
    { id: 2, title: 'French Phrases', content: 'Bonjour, Merci, Au revoir' },
  ]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Language Learning Notes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notes.map(note => (
          <Note key={note.id} note={note} />
        ))}
      </div>
    </div>
  );
};

export default Home;
