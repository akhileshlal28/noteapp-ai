// MainDashboard.jsx
import React, { useState, useEffect } from "react";
import NoteCard from "../components/NoteCard";
import Notemodal from "../components/Notemodal";
import PinnedNote from "./PinnedNote";

const MainDashboard = () => {
  const [notes, setNotes] = useState([]);
  const [isModalOpen, setModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:3000/api/notes", {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const arr = Array.isArray(data)
          ? data
          : data.notes ?? data.payload ?? [];
        console.log("fetched notes:", arr);
        setNotes(arr);
      })
      .catch((err) => console.error("Error fetching notes:", err));
  }, []);

  // normalized notes helper
  const notesArray = Array.isArray(notes) ? notes : [];
  const hasNotes = notesArray.length > 0;

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
    const token = localStorage.getItem("token");
    fetch(`http://localhost:3000/api/notes/${_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ ...note, pinned: !note.pinned }),
    })
      .then((res) => res.json())
      .then((data) => {
        const updated = data.note ?? data;
        setNotes((prev) => prev.map((n) => (n._id === _id ? updated : n)));
      });
  };

  const favouriteNotes = (_id) => {
    const note = notes.find((n) => n._id === _id);
    const token = localStorage.getItem("token");
    fetch(`http://localhost:3000/api/notes/${_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ ...note, favourite: !note.favourite }),
    })
      .then((res) => res.json())
      .then((data) => {
        const updated = data.note ?? data;
        setNotes((prev) => prev.map((n) => (n._id === _id ? updated : n)));
      });
  };

  const addNote = (newNote) => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:3000/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(newNote),
    })
      .then((res) => res.json())
      .then((data) => {
        const created = data.note ?? data;
        setNotes((prev) => [created, ...prev]);
      })
      .catch((err) => console.error("Error creating note:", err));
  };
  return (
    <div>
      <h1 className="text-2xl font-semibold indent-6 text-gray-800">
        Your Notes
      </h1>
      <div className="p-6">
        {hasNotes ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {notesArray.filter(Boolean).map((note) => (
              <NoteCard
                key={note._id ?? note.id}
                title={note?.title ?? ""}
                content={note?.content ?? ""}
                date={note?.date ?? ""}
                note={note}
                onShowMore={() => handleShowMore(note)}
                togglePin={() => pinnedNotes(note._id)}
                toggleFav={() => favouriteNotes(note._id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 border rounded-md bg-gray-50">
            <p className="text-gray-600 mb-2">No notes to show.</p>
            <p className="text-gray-500 text-sm">
              Click the + button to add your first note.
            </p>
          </div>
        )}

        <button
          onClick={() => {
            setModal(true);
            setSelectedNote(null);
          }}
          className="text-2xl cursor-pointer fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-b-full shadow-lg hover:bg-blue-600 transition-colors duration-300"
        >
          +
        </button>
      </div>
      {isModalOpen && (
        <Notemodal
          note={selectedNote}
          onClose={handleCloseModal}
          setNotes={setNotes}
          addNote={addNote}
        />
      )}
    </div>
  );
};

export default MainDashboard;
