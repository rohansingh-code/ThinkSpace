import express from "express";
import {
  createNote,
  deleteNote,
  getAllNotes,
  updateNote,
  getNoteById,
} from "../controllers/notesController.js";

import { apiLimiter, geminiLimiter } from "../Middleware/rateLimiter.js";

const router = express.Router();

// Get all notes
router.get("/", apiLimiter, getAllNotes);



// Get note by id
router.get("/:id", apiLimiter, getNoteById);

// Create note (uses Gemini AI)
router.post("/", geminiLimiter, createNote);

// Update note (uses Gemini AI again)
router.put("/:id", geminiLimiter, updateNote);

// Delete note
router.delete("/:id", apiLimiter, deleteNote);

export default router;