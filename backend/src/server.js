import express from "express";
import notesRoutes from "./routes/notesRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { connectDb } from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import protect from "./Middleware/auth.middleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// Middleware
if (process.env.NODE_ENV !== "production") {
  app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
  }));
}
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);          // authLimiter applied inside userRoutes
app.use("/api/notes", protect, notesRoutes); // apiLimiter/geminiLimiter applied inside notesRoutes

// Production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log("server started on port 5001");
  });
});
