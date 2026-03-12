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


router.get("/", apiLimiter, getAllNotes);



router.get("/:id", apiLimiter, getNoteById);

router.post("/", geminiLimiter, createNote);

router.put("/:id", geminiLimiter, updateNote);

router.delete("/:id", apiLimiter, deleteNote);

export default router;