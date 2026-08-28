import express from "express";
import { userSignup, userLogin, refreshAccessToken, logout, userDetail } from "../controllers/userController.js";
import protect from "../Middleware/auth.middleware.js";
import { authLimiter } from "../Middleware/rateLimiter.js";
import { validateBody } from "../Middleware/note.validation.js";
import { loginSchema, signupSchema } from "../validation/user.schema.js";

const router = express.Router();

router.post("/signup", authLimiter,validateBody(signupSchema), userSignup);
router.post("/login", authLimiter,validateBody(loginSchema),userLogin);
router.post("/refreshtoken", authLimiter, refreshAccessToken);
router.get("/me", protect, userDetail);
router.post("/logout", logout);

export default router;
