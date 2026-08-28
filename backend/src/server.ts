import express, { type Request, type Response } from "express";
import notesRoutes from "./routes/notesRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import protect from "./Middleware/auth.middleware.js";

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || "5001", 10);
const __dirname = path.resolve();

if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
}

app.use(cookieParser());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/notes", protect, notesRoutes);

app.get("/api/health", (_req: Request, res: Response): void => {
  res.send("Server running");
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (_req: Request, res: Response): void => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
