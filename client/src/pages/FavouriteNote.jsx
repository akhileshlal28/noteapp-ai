import React from "react";
import { useState } from "react";
import NoteCard from "../components/NoteCard";
import Notemodal from "../components/Notemodal";
const FavouriteNote = ({ notes, setNotes }) => {
  const [isModalOpen, setModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const handleShowMore = (note) => {
    setSelectedNote(note);
    setModal(true);
  };

  const handleCloseModal = () => {
    setSelectedNote(null);
    setModal(false);
  };

  const favouriteNotes = (_id) => {
    const note = notes.find((n) => n._id === _id);
    fetch(`hhttps://noteapp-ai.onrender.com/api/notes/${_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...note, favourite: !note.favourite }),
    })
      .then((res) => res.json())
      .then((data) => {
        setNotes((prev) => prev.map((n) => (n._id === _id ? data.note : n)));
      });
  };

  const favouriteNotesList = notes.filter((note) => note.favourite);

  return (
    <div>
      <h2 className="text-2xl font-semibold indent-6 text-gray-800">
        Favourite Notes
      </h2>
      {favouriteNotesList.length > 0 ? (
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favouriteNotesList.map((note) => (
            <NoteCard
              key={note._id}
              title={note.title}
              content={note.content}
              date={note.date}
              note={note}
              onShowMore={() => handleShowMore(note)}
              toggleFav={() => favouriteNotes(note._id)}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 indent-6">No favourite notes available.</p>
      )}
      {isModalOpen && (
        <Notemodal
          note={selectedNote}
          onClose={handleCloseModal}
          setNotes={setNotes}
        />
      )}
    </div>
  );
};

export default FavouriteNote;
