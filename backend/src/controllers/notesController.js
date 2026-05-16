import Note from "../models/Note.js";
import { processNoteWithAI } from "../ai/aiService.js";
import { redis } from "../config/upstash.js";

const NOTES_CACHE_TTL = 3600; // 1 hour

// e.g. "notes:list:64f3a..." — one key per user
const notesCacheKey = (userId) => `notes:list:${userId}`;


export const getAllNotes = async (req, res) => {
  try {
    const { search } = req.query;
    let query = { user: req.user._id };

    if (search) {
      // Search results aren't cached — too many possible query combinations
      // to track and invalidate cleanly. Just hit the DB directly.
      const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$or = [
        { title: { $regex: safeSearch, $options: "i" } },
        { content: { $regex: safeSearch, $options: "i" } },
        { tags: { $in: [new RegExp(safeSearch, "i")] } },
      ];

      const notes = await Note.find(query).sort({ createdAt: -1 });
      return res.status(200).json(notes);
    }

    // Check cache first
    const cacheKey = notesCacheKey(req.user._id);
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        console.log("Serving notes from cache");
        return res.status(200).json(cached);
      }
    } catch (redisError) {
      // If redis is down, we just log it and continue to DB
      console.error("Redis get error:", redisError);
    }

    // Cache miss — fetch from DB and store for next time
    const notes = await Note.find(query).sort({ createdAt: -1 });

    try {
      // Upstash handles serialization automatically
      await redis.set(cacheKey, notes, { ex: NOTES_CACHE_TTL });
    } catch (redisError) {
      console.error("Redis set error:", redisError);
    }

    return res.status(200).json(notes);
  } catch (error) {
    console.error("Error in getAllNotes method", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({ message: "note not found" });
    }

    return res.status(200).json(note);
  } catch (error) {
    console.error("Error in getNoteById method", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    const aiData = await processNoteWithAI(content);

    const note = await Note.create({
      title: title || aiData.title || "Untitled",
      content,
      summary: aiData.summary,
      tags: aiData.tags,
      user: req.user._id,
    });

    // New note created — bust the cache so the list reflects it immediately
    try {
      await redis.del(notesCacheKey(req.user._id));
    } catch (redisError) {
      console.error("Redis delete error:", redisError);
    }

    res.status(201).json(note);
  } catch (error) {
    console.error("Error in createNote method", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    let aiData = {};
    if (content) {
      aiData = await processNoteWithAI(content);
    }

    const updatedNote = await Note.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      {
        title: aiData.title || title || "Untitled",
        content,
        summary: aiData.summary,
        tags: aiData.tags,
      },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Note changed — stale cache needs to go
    try {
      await redis.del(notesCacheKey(req.user._id));
    } catch (redisError) {
      console.error("Redis delete error:", redisError);
    }

    res.status(200).json(updatedNote);
  } catch (error) {
    console.error("Error in updateNote method", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const deleteNote = async (req, res) => {
  try {
    const deletedNote = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!deletedNote) {
      return res.status(404).json({ message: "note not found" });
    }

    // Note deleted — clear the cache so it doesn't show up on the next fetch
    try {
      await redis.del(notesCacheKey(req.user._id));
    } catch (redisError) {
      console.error("Redis delete error:", redisError);
    }

    return res.status(200).json({ message: "Note deleted successfully!" });
  } catch (error) {
    console.error("Error in deleteNote method", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};