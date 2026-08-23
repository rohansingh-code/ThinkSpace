import prisma from "../config/prisma.js";
import { processNoteWithAI } from "../ai/aiService.js";
import { redis } from "../config/upstash.js";

const NOTES_CACHE_TTL = 3600; // 1 hour

// Creates a unique Redis cache key for each user
// Example: notes:list:64f3a...
const notesCacheKey = (userId) => `notes:list:${userId}`;


// ============================================================
// GET ALL NOTES
// GET /api/notes
// GET /api/notes?search=javascript
// ============================================================

export const getAllNotes = async (req, res) => {
  try {
    const { search } = req.query;

    // With Prisma/PostgreSQL, our User -> Note relationship
    // uses an explicit foreign key called userId.
    //
    // MongoDB:
    // user: req.user._id
    //
    // PostgreSQL:
    // userId: req.user.id
    const userId = req.user.id;


    // ========================================================
    // SEARCH
    // ========================================================

    if (search) {
      /*
        MongoDB version used:

        $or
        $regex
        $in

        Prisma uses its own filtering syntax instead.
      */

      const where = {
        userId,

        OR: [
          // Search inside the title
          {
            title: {
              contains: search,
              mode: "insensitive",
            },
          },

          // Search inside the content
          {
            content: {
              contains: search,
              mode: "insensitive",
            },
          },

          // Search for an exact tag
          //
          // Because tags is defined as:
          //
          // tags String[]
          //
          // PostgreSQL can search whether the array
          // contains a particular value.
          {
            tags: {
              has: search,
            },
          },
        ],
      };


      // Search results are not cached.
      //
      // There can be many combinations:
      // search=java
      // search=javascript
      // search=database
      // etc.
      //
      // So we directly query PostgreSQL.
      const notes = await prisma.note.findMany({
        where,

        // Same as MongoDB:
        // .sort({ createdAt: -1 })
        orderBy: {
          createdAt: "desc",
        },
      });

      return res.status(200).json(notes);
    }


    // ========================================================
    // NORMAL GET ALL NOTES
    // ========================================================

    // Create the Redis key for this particular user.
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
      // Redis failure should NOT stop the application.
      //
      // If Redis is unavailable, we'll simply fetch
      // the notes from PostgreSQL.
      console.error("Redis get error:", redisError);
    }


    // ========================================================
    // CACHE MISS -> FETCH FROM POSTGRESQL
    // ========================================================

    /*
      MongoDB:

      Note.find({
        user: req.user._id
      }).sort({
        createdAt: -1
      });

      Prisma:

      prisma.note.findMany({
        where: {
          userId
        },
        orderBy: {
          createdAt: "desc"
        }
      });
    */

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
      // Cache the notes for 1 hour.
      await redis.set(cacheKey, notes, {
        ex: NOTES_CACHE_TTL,
      });
    } catch (redisError) {
      // Again, Redis failure shouldn't break the request.
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

export const getNoteById = async (req, res) => {
  try {

    /*
      MongoDB:

      Note.findOne({
        _id: req.params.id,
        user: req.user._id
      });

      Prisma:

      We use findFirst because we're checking TWO conditions:

      1. Note ID
      2. User ID

      This also makes sure a user cannot access
      another user's note simply by changing the ID.
    */

    const note = await prisma.note.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
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

export const createNote = async (req, res) => {
  try {

    const { title, content } = req.body;


    // ========================================================
    // PROCESS CONTENT USING AI
    // ========================================================

    const aiData = await processNoteWithAI(content);


    // ========================================================
    // CREATE NOTE IN POSTGRESQL
    // ========================================================

    /*
      MongoDB:

      Note.create({
        title,
        content,
        summary,
        tags,
        user: req.user._id
      });

      Prisma:

      prisma.note.create({
        data: {
          ...
        }
      });

      Notice that the relationship field is now:

      userId

      instead of:

      user
    */

    const note = await prisma.note.create({
      data: {
        title: title || aiData.title || "Untitled",

        content,

        summary: aiData.summary,

        tags: aiData.tags,

        // Foreign key to the User table
        userId: req.user.id,
      },
    });


    // ========================================================
    // INVALIDATE CACHE
    // ========================================================

    /*
      We just created a new note.

      Therefore, the cached list of notes is now outdated.

      Delete the cache so the next GET request fetches
      the latest notes from PostgreSQL.
    */

    try {
      await redis.del(notesCacheKey(req.user.id));
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

export const updateNote = async (req, res) => {
  try {

    const { title, content } = req.body;


    // ========================================================
    // PROCESS CONTENT WITH AI IF CONTENT CHANGED
    // ========================================================

    let aiData = {};

    if (content) {
      aiData = await processNoteWithAI(content);
    }


    // ========================================================
    // CHECK OWNERSHIP
    // ========================================================

    /*
      MongoDB allowed:

      Note.findOneAndUpdate({
        _id: req.params.id,
        user: req.user._id
      });

      Prisma's update() requires a unique field.

      Our `id` is unique, but we also need to make sure
      that this note belongs to the logged-in user.

      Therefore:

      Step 1 -> find the note using ID + userId
      Step 2 -> update using the unique ID
    */

    const note = await prisma.note.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });


    // Note doesn't exist OR doesn't belong to this user.
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
        id: req.params.id,
      },

      data: {
        title: aiData.title || title || "Untitled",

        content,

        summary: aiData.summary,

        tags: aiData.tags,
      },
    });


    // ========================================================
    // INVALIDATE REDIS CACHE
    // ========================================================

    try {
      await redis.del(notesCacheKey(req.user.id));
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

export const deleteNote = async (req, res) => {
  try {

    // ========================================================
    // CHECK OWNERSHIP
    // ========================================================

    /*
      MongoDB:

      Note.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id
      });

      Prisma:

      First check that the note belongs to the user.
    */

    const note = await prisma.note.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
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
        id: req.params.id,
      },
    });


    // ========================================================
    // INVALIDATE CACHE
    // ========================================================

    try {
      await redis.del(notesCacheKey(req.user.id));
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