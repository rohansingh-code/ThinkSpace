import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";


const protect = async (req, res, next) => {
  try {

    // ========================================================
    // GET ACCESS TOKEN
    // ========================================================

    // The access token is stored in an HTTP-only cookie.
    const accessToken = req.cookies.accessToken;


    if (!accessToken) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }


    // ========================================================
    // VERIFY JWT
    // ========================================================

    /*
      jwt.verify() checks:

      1. Is the token valid?
      2. Has it been tampered with?
      3. Has it expired?
      4. Was it signed using JWT_SECRET?

      The decoded object should contain:

      {
        userId: "..."
      }
    */

    const decoded = jwt.verify(
      accessToken,
      process.env.JWT_SECRET
    );


    // ========================================================
    // FIND USER IN POSTGRESQL
    // ========================================================

    /*
      BEFORE:

      req.user = await User.findById(decoded.userId)
        .select("-password");

      NOW:

      We use Prisma to find the user in PostgreSQL.
    */

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },

      /*
        We don't want to expose the password hash
        to the rest of the application.

        Prisma doesn't have Mongoose's:

        .select("-password")

        Instead, we explicitly select the fields
        that we want.
      */

      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });


    // ========================================================
    // USER NOT FOUND
    // ========================================================

    if (!user) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }


    // ========================================================
    // ATTACH USER TO REQUEST
    // ========================================================

    /*
      This is important.

      Other controllers can now access:

      req.user.id
      req.user.name
      req.user.email

      For example, your Note controller uses:

      req.user.id
    */

    req.user = user;


    // Continue to the actual route.
    next();

  } catch (error) {

    console.error("Authentication error:", error);

    return res.status(401).json({
      message: "Not authorized",
    });
  }
};


export default protect;