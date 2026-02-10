import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.userId).select("-password");

    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized" });
  }
};

export default protect;
