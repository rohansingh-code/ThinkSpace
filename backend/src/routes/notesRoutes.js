import express from "express";
import {
  createNote,
  deleteNote,
  getAllNotes,
  updateNote,
  getNoteById
} from "../controllers/notesController.js";

import rateLimiter from "../Middleware/rateLimiter.js";

const router = express.Router();

router.get("/", getAllNotes);
router.get("/:id", getNoteById);

router.post("/", rateLimiter, createNote);
router.put("/:id", rateLimiter, updateNote);

router.delete("/:id", deleteNote);

export default router;