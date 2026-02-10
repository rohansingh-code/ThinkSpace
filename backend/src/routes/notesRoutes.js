import express from "express";
import {createNote,deleteNote,getAllNotes,updateNote,getNoteById} from "../controllers/notesController.js"
import protect from "../Middleware/auth.middleware.js";

const router = express.Router();


router.get("/",protect,getAllNotes);
router.get("/:id",protect,getNoteById);
router.post("/",protect,createNote);
router.put("/:id",protect,updateNote);
router.delete("/:id",protect,deleteNote);




export default router;