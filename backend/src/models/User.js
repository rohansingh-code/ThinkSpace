import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,      // 🔥 very important
      lowercase: true,   // 🔥 avoids duplicate emails
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }  // 🔥 createdAt & updatedAt
);

export default mongoose.model("User", userSchema);
