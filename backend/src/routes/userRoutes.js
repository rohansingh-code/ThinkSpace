import express from "express";
import { userSignup,userLogin, refreshAccessToken } from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", userSignup);
router.post("/login", userLogin);
router.post("/refreshtoken",refreshAccessToken)

export default router;
