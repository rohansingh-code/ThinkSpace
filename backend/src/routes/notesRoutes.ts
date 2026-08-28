import express from "express";
import {
  createNote,
  deleteNote,
  getAllNotes,
  updateNote,
  getNoteById,
} from "../controllers/notesController.js";

import { apiLimiter, geminiLimiter } from "../Middleware/rateLimiter.js";
import { validateBody } from "../Middleware/note.validation";
import { createNoteSchema,updateNoteSchema} from "../validation/note.schema";

const router = express.Router();
router.get(
  "/",
  apiLimiter,
  getAllNotes
);

router.get(
  "/:id",
  apiLimiter,
  getNoteById
);

router.post(
  "/",
  geminiLimiter,
  validateBody(createNoteSchema),
  createNote
);

router.put(
  "/:id",
  geminiLimiter,
  validateBody(updateNoteSchema),
  updateNote
);

router.delete(
  "/:id",
  apiLimiter,
  deleteNote
);

export default router;
