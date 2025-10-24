import React, { useEffect, useState } from "react";
import { Trash, Pencil, ArrowLeft } from "lucide-react";

const Notemodal = ({ note, onClose, setNotes, addNote }) => {
  const isAddMode = note === null;
  const [isEditing, setIsEditing] = useState(isAddMode);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [aiSummary, setAiSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);

  useEffect(() => {
    if (note) {
      setEditTitle(note.title);
      setEditContent(note.content);
      setIsEditing(false);
    } else {
      setEditTitle("");
      setEditContent("");
      setIsEditing(true);
    }
  }, [note]);

  const handleSave = () => {
    // Add mode: delegate to addNote (MainDashboard does authorized POST)
    if (isAddMode) {
      const newNote = {
        title: editTitle,
        content: editContent,
        pinned: false,
        favourite: false,
        date: new Date().toLocaleString(),
      };
      if (typeof addNote === "function") {
        addNote(newNote);
      } else {
        // fallback: if addNote not provided, do authorized POST here
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
      }
    } else {
      // editing existing note: perform PUT with auth header
      const token = localStorage.getItem("token");
      fetch(`http://localhost:3000/api/notes/${note._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title: editTitle,
          content: editContent,
          pinned: note.pinned,
          favourite: note.favourite,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          const updated = data.note ?? data;
          setNotes((prev) =>
            prev.map((n) => (n._id === updated._id ? updated : n))
          );
        })
        .catch((err) => console.error("Error updating note:", err));
    }

    onClose();
  };

  const handleEdit = async () => {
    if (!note) return;
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:3000/api/notes/${note._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title: editTitle,
          content: editContent,
          pinned: note.pinned,
          favourite: note.favourite,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.error("Edit failed", res.status, data);
        return;
      }

      const updated = data.note ?? data;
      setNotes((prev) =>
        prev.map((n) => (n._id === updated._id ? updated : n))
      );
      setIsEditing(false);
      onClose();
    } catch (error) {
      console.error("Network error updating note:", error);
    }
  };

  const handleDelete = async () => {
    if (!note) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:3000/api/notes/${note._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("Delete failed", res.status, err);
        return;
      }
      // Option A: update local state directly
      setNotes((prev) => prev.filter((n) => n._id !== note._id));
      // Option B: refetch all notes from backend for canonical state:
      // await fetchNotes(); // implement fetchNotes in parent and pass down
      onClose();
    } catch (error) {
      console.error("Network error deleting note:", error);
    }
  };

  const handleSummarize = async () => {
    const textToSummarize = note
      ? `${note.title}\n\n${note.content}`
      : editContent;
    if (!textToSummarize) return;
    setIsSummarizing(true);
    setAiSummary("");
    console.log("Text sent for summarization:", textToSummarize);

    try {
      const response = await fetch("http://localhost:3000/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToSummarize }),
      });
      const data = await response.json();
      if (response.ok) {
        setAiSummary(data.summary);
      } else {
        console.error("Error generating summary:", data.message);
      }
    } catch (error) {
      console.error("An error occurred while generating the summary.", error);
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 rounded-lg p-6 max-w-md w-full h-fit border-2 border-blue-500 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <ArrowLeft onClick={onClose} className="text-white cursor-pointer" />

        {isEditing ? (
          <>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full mb-4 p-2 rounded bg-gray-700 text-white"
              placeholder="Note Title"
            />
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full mb-4 p-2 rounded bg-gray-700 text-white h-32"
              placeholder="Note Content"
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded text-md cursor-pointer hover:bg-blue-600"
              onClick={() => (isAddMode ? handleSave() : handleEdit())}
            >
              Save
            </button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4 mt-4 text-white">
              {note.title}
            </h2>
            <p className="mb-4 text-white overflow-y-auto">{note.content}</p>

            <div className="flex justify-between items-center">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded text-md cursor-pointer hover:bg-blue-600"
                onClick={handleSummarize}
                disabled={isSummarizing}
              >
                {isSummarizing ? "Summarizing..." : "Summarize"}
              </button>

              <div>
                <Pencil
                  className="inline-block text-blue-500 mr-2 cursor-pointer"
                  size={16}
                  onClick={() => setIsEditing(true)}
                />
                <Trash
                  className="inline-block text-red-500 cursor-pointer"
                  size={16}
                  onClick={handleDelete}
                />
              </div>
            </div>

            {/* --- Collapsible AI Summary Section --- */}
            {aiSummary && (
              <details className="mt-4 bg-gray-700 p-3 rounded text-white">
                <summary className="cursor-pointer font-semibold text-blue-400">
                  View AI Summary
                </summary>
                <p className="mt-2 text-gray-200 whitespace-pre-line">
                  {aiSummary}
                </p>
              </details>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Notemodal;
