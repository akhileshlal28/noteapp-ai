import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import Note from "./models/note.js";
import router from "./routes/noteRoutes.js";
import aiRouter from "./routes/aiRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: [
      "https://akhileshlal28.github.io", // GitHub Pages domain
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/notes", router);
app.use("/api/ai", aiRouter);
app.use("/api/auth", authRoutes);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// app.get("/health", (req, res) => {
//   res.status(200).send("Server is healthy");
// });

// app.get("/test-route", async (req, res) => {
//   const sample = new Note({
//     title: "Test Note",
//     content: "THis is a test note.",
//   });
//   await sample
//     .save()
//     .then(() => {
//       res.status(200).send("Test note created !!");
//     })
//     .catch((err) => {
//       res.status(500).send("Error creating test note");
//     });
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});
