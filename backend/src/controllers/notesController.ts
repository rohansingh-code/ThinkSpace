import type { Response } from "express";
import prisma from "../config/prisma.js";
import { processNoteWithAI } from "../ai/aiService.js";
import { redis } from "../config/upstash.js";
import type { AuthenticatedRequest } from "../Middleware/auth.middleware.js";

const NOTES_CACHE_TTL = 3600; // 1 hour

const notesCacheKey = (userId: string) => `notes:list:${userId}`;

// ============================================================
// GET ALL NOTES
// GET /api/notes
// GET /api/notes?search=javascript
// ============================================================

export const getAllNotes = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { search } = req.query;

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    // ========================================================
    // SEARCH
    // ========================================================

    if (search && typeof search === "string") {
      const where = {
        userId,

        OR: [
          // Search inside the title
          {
            title: {
              contains: search,
              mode: "insensitive" as const,
            },
          },

          // Search inside the content
          {
            content: {
              contains: search,
              mode: "insensitive" as const,
            },
          },

          // Search for an exact tag
          {
            tags: {
              has: search,
            },
          },
        ],
      };

      const notes = await prisma.note.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
      });

      return res.status(200).json(notes);
    }

    // ========================================================
    // NORMAL GET ALL NOTES
    // ========================================================

    const cacheKey = notesCacheKey(userId);

    // ========================================================
    // CHECK REDIS CACHE
    // ========================================================

    try {
      const cached = await redis.get(cacheKey);

      if (cached) {
        console.log("Serving notes from cache");

        return res.status(200).json(cached);
      }
    } catch (redisError) {
      console.error("Redis get error:", redisError);
    }

    // ========================================================
    // CACHE MISS -> FETCH FROM POSTGRESQL
    // ========================================================

    const notes = await prisma.note.findMany({
      where: {
        userId,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    // ========================================================
    // STORE RESULT IN REDIS
    // ========================================================

    try {
      await redis.set(cacheKey, notes, {
        ex: NOTES_CACHE_TTL,
      });
    } catch (redisError) {
      console.error("Redis set error:", redisError);
    }

    return res.status(200).json(notes);

  } catch (error) {
    console.error("Error in getAllNotes method:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ============================================================
// GET NOTE BY ID
// GET /api/notes/:id
// ============================================================

export const getNoteById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    const id = req.params.id as string;

    const note = await prisma.note.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    return res.status(200).json(note);

  } catch (error) {
    console.error("Error in getNoteById method:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ============================================================
// CREATE NOTE
// POST /api/notes
// ============================================================

export const createNote = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, content } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    // ========================================================
    // PROCESS CONTENT USING AI
    // ========================================================

    const aiData = await processNoteWithAI(content);

    // ========================================================
    // CREATE NOTE IN POSTGRESQL
    // ========================================================

    const note = await prisma.note.create({
      data: {
        title: title || aiData.title || "Untitled",
        content,
        summary: aiData.summary,
        tags: aiData.tags,
        userId,
      },
    });

    // ========================================================
    // INVALIDATE CACHE
    // ========================================================

    try {
      await redis.del(notesCacheKey(userId));
    } catch (redisError) {
      console.error("Redis delete error:", redisError);
    }

    return res.status(201).json(note);

  } catch (error) {
    console.error("Error in createNote method:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ============================================================
// UPDATE NOTE
// PUT /api/notes/:id
// ============================================================

export const updateNote = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, content } = req.body;

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    const id = req.params.id as string;

    // ========================================================
    // PROCESS CONTENT WITH AI IF CONTENT CHANGED
    // ========================================================

    let aiData: any = {};

    if (content) {
      aiData = await processNoteWithAI(content);
    }

    // ========================================================
    // CHECK OWNERSHIP
    // ========================================================

    const note = await prisma.note.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    // ========================================================
    // UPDATE NOTE IN POSTGRESQL
    // ========================================================

    const updatedNote = await prisma.note.update({
      where: {
        id,
      },
      data: {
        title: aiData.title || title || note.title,
        content: content || note.content,
        summary: aiData.summary !== undefined ? aiData.summary : note.summary,
        tags: aiData.tags !== undefined ? aiData.tags : note.tags,
      },
    });

    // ========================================================
    // INVALIDATE REDIS CACHE
    // ========================================================

    try {
      await redis.del(notesCacheKey(userId));
    } catch (redisError) {
      console.error("Redis delete error:", redisError);
    }

    return res.status(200).json(updatedNote);

  } catch (error) {
    console.error("Error in updateNote method:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// ============================================================
// DELETE NOTE
// DELETE /api/notes/:id
// ============================================================

export const deleteNote = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    const id = req.params.id as string;

    // ========================================================
    // CHECK OWNERSHIP
    // ========================================================

    const note = await prisma.note.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    // ========================================================
    // DELETE FROM POSTGRESQL
    // ========================================================

    await prisma.note.delete({
      where: {
        id,
      },
    });

    // ========================================================
    // INVALIDATE CACHE
    // ========================================================

    try {
      await redis.del(notesCacheKey(userId));
    } catch (redisError) {
      console.error("Redis delete error:", redisError);
    }

    return res.status(200).json({
      message: "Note deleted successfully!",
    });

  } catch (error) {
    console.error("Error in deleteNote method:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
