import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    image: {
      type: String, 
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },

    category: {
      type: String,
      enum: ["general", "event", "urgent"],
      default: "general",
    },

    isImportant: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, 
  }
);

export default mongoose.model("Notice", noticeSchema);