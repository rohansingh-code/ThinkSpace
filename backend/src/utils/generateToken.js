import jwt from "jsonwebtoken";

// SHORT-LIVED token (used for API access)
export const generateAccessToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
};

// LONG-LIVED token (used to get new access tokens)
export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};
