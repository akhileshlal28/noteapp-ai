import { useState } from "react";
import NoteCard from "./NoteCard";
import Notemodal from "./Notemodal";
const AiSummary = () => {
  const [note, setNote] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateSummary = async () => {
    if (!note.trim()) {
      alert("Please enter a note to summarize.");
      return;
    }
    setError(null);
    setLoading(true);
    setSummary("");
    try {
      const response = await fetch("http://localhost:3000/api/ai-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note }),
      });
      const data = await response.json();
      if (response.ok) {
        setSummary(data.summary);
      } else {
        setError(data.error || "Failed to generate summary.");
      }
    } catch (error) {
      setError("An error occurred while generating the summary.");
    } finally {
      setLoading(false);
    }
  };
};

export default AiSummary;
