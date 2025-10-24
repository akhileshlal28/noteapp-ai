import express from "express";
import Note from "../models/note.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/test", (req, res) => {
  res.send("Routing is working fine");
});

// GET notes for authenticated user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId ?? req.user?._id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const notes = await Note.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error fetching notes", details: err.message });
  }
});

// Create a note and assign to authenticated user
router.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId ?? req.user?._id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { title, content, pinned = false, favourite = false } = req.body;
    const newNote = new Note({
      title,
      content,
      pinned,
      favourite,
      user: userId,
    });
    await newNote.save();
    res.status(201).json({ message: "Note created", note: newNote });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error creating note", details: err.message });
  }
});

// Update note only if it belongs to the authenticated user
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId ?? req.user?._id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { id } = req.params;
    const { title, content, pinned, favourite } = req.body;

    const updatedNote = await Note.findOneAndUpdate(
      { _id: id, user: userId },
      { title, content, pinned, favourite },
      { new: true }
    );

    if (!updatedNote)
      return res.status(404).json({ error: "Note not found or access denied" });

    res.status(200).json({ message: "Note updated", note: updatedNote });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error updating note", details: err.message });
  }
});

// Delete note only if it belongs to the authenticated user
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId ?? req.user?._id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { id } = req.params;
    const deletedNote = await Note.findOneAndDelete({ _id: id, user: userId });

    if (!deletedNote)
      return res.status(404).json({ error: "Note not found or access denied" });

    res.status(200).json({ message: "Note deleted", note: deletedNote });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error deleting note", details: err.message });
  }
});

export default router;
