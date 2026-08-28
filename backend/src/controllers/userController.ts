import type { Request, Response } from "express";
import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "../types/index.js";
import type { AuthenticatedRequest } from "../Middleware/auth.middleware.js";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";

// ============================================================
// USER SIGNUP
// POST /api/users/signup
// ============================================================

export const userSignup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({
      message: "Signup failed",
    });
  }
};

// ============================================================
// USER LOGIN
// POST /api/users/login
// ============================================================

export const userLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      message: "Login failed",
    });
  }
};

// ============================================================
// REFRESH ACCESS TOKEN
// POST /api/users/refreshtoken
// ============================================================

export const refreshAccessToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: "No refresh token",
      });
    }

    let decoded: JwtPayload;

    try {
      decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string
      ) as JwtPayload;
    } catch (err) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    const newAccessToken = generateAccessToken(decoded.userId);

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Access token refreshed",
    });

  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(401).json({
      message: "Invalid refresh token",
    });
  }
};

// ============================================================
// LOGOUT
// POST /api/users/logout
// ============================================================

export const logout = (req: Request, res: Response) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  return res.status(200).json({
    message: "Logged out successfully",
  });
};

// ============================================================
// USER DETAILS (/me)
// GET /api/users/me
// ============================================================

export const userDetail = async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "Auth error" });
  }
  const { id, name, email } = user;
  return res.status(200).json({ user: { id, name, email } });
};
