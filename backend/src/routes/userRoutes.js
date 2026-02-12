import express from "express";
import { userSignup,userLogin, refreshAccessToken, logout } from "../controllers/userController.js";
import protect from "../Middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", userSignup);
router.post("/login", userLogin);
router.post("/refreshtoken",refreshAccessToken);
router.get("/me", protect, (req, res) => {
  res.status(200).json({
    user: req.user
  });
});
router.post("/logout",logout);


export default router;


