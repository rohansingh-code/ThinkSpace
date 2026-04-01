import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: ""
    },

    content: {
      type: String,
    },

    summary: {
      type: String,
      default: ""
    },

    tags: {
      type: [String],
      default: []
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }

  },
  { timestamps: true }
);

export default mongoose.model("Note", noteSchema);