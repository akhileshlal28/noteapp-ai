import { GoogleGenAI } from "@google/genai";
import express from "express";
import "dotenv/config";

const aiRouter = express.Router();

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});
aiRouter.post("/summarize", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const model = "gemini-2.5-flash";
    const prompt = `Summarize the following note concisely:\n\n${text}`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    const summary = response.text;
    res.json({ summary });
  } catch (error) {
    console.error("Error generating summary:", error);
    res.status(500).json({ error: "Failed to generate summary" });
  }
});

export default aiRouter;
