import React from 'react';

interface NoteProps {
  note: {
    id: string;
    title: string;
    content: string;
    language: string;
  };
}

const Note: React.FC<NoteProps> = ({ note }) => {
  return (
    <div className="border p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold">{note.title}</h2>
      <p>{note.content}</p>
      <p className="text-sm text-gray-500">{note.language}</p>
    </div>
  );
};

export default Note;
