import express from "express";
import { userSignup, userLogin, refreshAccessToken, logout } from "../controllers/userController.js";
import protect from "../Middleware/auth.middleware.js";
import { authLimiter } from "../Middleware/rateLimiter.js";

const router = express.Router();

router.post("/signup", authLimiter, userSignup);
router.post("/login", authLimiter, userLogin);
router.post("/refreshtoken", authLimiter, refreshAccessToken);
router.get("/me", protect, (req, res) => {
  res.status(200).json({
    user: req.user
  });
});
router.post("/logout", logout);

export default router;