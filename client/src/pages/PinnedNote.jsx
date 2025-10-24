import React, { useState } from "react";
import NoteCard from "../components/NoteCard";
import Notemodal from "../components/Notemodal";

const PinnedNote = ({ notes, setNotes }) => {
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

  const pinnedNotes = (_id) => {
    const note = notes.find((n) => n._id === _id);
    fetch(`http://localhost:3000/api/notes/${_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...note, pinned: !note.pinned }),
    })
      .then((res) => res.json())
      .then((data) => {
        setNotes((prev) => prev.map((n) => (n._id === _id ? data.note : n)));
      });
  };

  const pinnedNotesList = notes.filter((note) => note.pinned);

  return (
    <div>
      <h2 className="text-2xl font-semibold indent-6 text-gray-800">
        Pinned Notes
      </h2>
      {pinnedNotesList.length > 0 ? (
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pinnedNotesList.map((note) => (
            <NoteCard
              key={note._id}
              title={note.title}
              content={note.content}
              date={note.date}
              note={note}
              onShowMore={() => handleShowMore(note)}
              togglePin={() => pinnedNotes(note._id)}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 indent-6">No pinned notes available.</p>
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

export default PinnedNote;
