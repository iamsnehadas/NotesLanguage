import React from 'react';

interface NoteProps {
  note: {
    id: string;
    title: string;
    content: string;
    language: string;
  };
  onDelete: (id: string) => void;
}

const Note: React.FC<NoteProps> = ({ note, onDelete }) => {
  return (
    <div className="bg-blue-100 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 relative">
      <h2 className="text-2xl font-bold mb-2 text-blue-700">{note.title}</h2>
      <p className="text-gray-800 mb-4">{note.content}</p>
      <p className="text-sm text-gray-600">{note.language}</p>
      <button
        onClick={() => onDelete(note.id)}
        className="del absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition duration-300"
      >
        X
      </button>
    </div>
  );
};

export default Note;
