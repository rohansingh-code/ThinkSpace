import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";


// ============================================================
// USER SIGNUP
// POST /api/users/signup
// ============================================================

export const userSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};


    // ========================================================
    // VALIDATION
    // ========================================================

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }


    // Normalize email so:
    // Test@Email.com
    // test@email.com
    //
    // are treated as the same email.
    const normalizedEmail = email.toLowerCase();


    // ========================================================
    // CHECK IF USER ALREADY EXISTS
    // ========================================================

    /*
      MongoDB:

      const existingUser = await User.findOne({
        email: normalizedEmail
      });

      Prisma:

      Since email is marked @unique in schema.prisma:

      email String @unique

      we can use findUnique().
    */

    const existingUser = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });


    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }


    // ========================================================
    // HASH PASSWORD
    // ========================================================

    // We continue using bcrypt exactly as before.
    // Prisma does NOT hash passwords automatically.

    const hashedPassword = await bcrypt.hash(password, 10);


    // ========================================================
    // CREATE USER
    // ========================================================

    /*
      MongoDB:

      const user = await User.create({
        name,
        email,
        password
      });

      Prisma:

      prisma.user.create({
        data: {
          ...
        }
      });
    */

    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
      },
    });


    // ========================================================
    // GENERATE JWT TOKENS
    // ========================================================

    /*
      MongoDB used:

      user._id

      PostgreSQL/Prisma uses:

      user.id
    */

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);


    // ========================================================
    // ACCESS TOKEN COOKIE
    // ========================================================

    res.cookie("accessToken", accessToken, {
      httpOnly: true,

      secure: process.env.NODE_ENV === "production",

      sameSite: "strict",

      maxAge: 15 * 60 * 1000,
    });


    // ========================================================
    // REFRESH TOKEN COOKIE
    // ========================================================

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,

      secure: process.env.NODE_ENV === "production",

      sameSite: "strict",

      maxAge: 7 * 24 * 60 * 60 * 1000,
    });


    // ========================================================
    // RESPONSE
    // ========================================================

    /*
      Don't send the password back to the client.

      We only return the fields the frontend needs.
    */

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

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body || {};


    // ========================================================
    // VALIDATION
    // ========================================================

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }


    const normalizedEmail = email.toLowerCase();


    // ========================================================
    // FIND USER
    // ========================================================

    /*
      MongoDB:

      User.findOne({
        email: normalizedEmail
      });

      Prisma:

      Because email is unique, use findUnique().
    */

    const user = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });


    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }


    // ========================================================
    // COMPARE PASSWORD
    // ========================================================

    /*
      The password stored in PostgreSQL is the bcrypt hash.

      We compare:

      password entered by user
              ↓
      bcrypt.compare()
              ↓
      hashed password from PostgreSQL
    */

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );


    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }


    // ========================================================
    // GENERATE TOKENS
    // ========================================================

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);


    // ========================================================
    // ACCESS TOKEN COOKIE
    // ========================================================

    res.cookie("accessToken", accessToken, {
      httpOnly: true,

      secure: process.env.NODE_ENV === "production",

      sameSite: "strict",

      maxAge: 15 * 60 * 1000,
    });


    // ========================================================
    // REFRESH TOKEN COOKIE
    // ========================================================

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,

      secure: process.env.NODE_ENV === "production",

      sameSite: "strict",

      maxAge: 7 * 24 * 60 * 60 * 1000,
    });


    // ========================================================
    // RESPONSE
    // ========================================================

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
// ============================================================

export const refreshAccessToken = async (req, res) => {
  try {

    // Get refresh token from HTTP-only cookie.
    const refreshToken = req.cookies.refreshToken;


    if (!refreshToken) {
      return res.status(401).json({
        message: "No refresh token",
      });
    }


    // ========================================================
    // VERIFY REFRESH TOKEN
    // ========================================================

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );


    // ========================================================
    // GENERATE NEW ACCESS TOKEN
    // ========================================================

    /*
      Notice that this does NOT need Prisma.

      The JWT already contains the userId.

      decoded.userId
          ↓
      generateAccessToken()
    */

    const newAccessToken = generateAccessToken(
      decoded.userId
    );


    // ========================================================
    // SET NEW ACCESS TOKEN COOKIE
    // ========================================================

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
// ============================================================

export const logout = (req, res) => {

  // Remove access token cookie.
  res.clearCookie("accessToken");

  // Remove refresh token cookie.
  res.clearCookie("refreshToken");


  return res.status(200).json({
    message: "Logged out successfully",
  });
};