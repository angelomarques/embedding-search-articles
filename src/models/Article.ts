import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      maxlength: [300, "Title cannot be more than 100 characters"],
    },
    author: {
      type: String,
      required: [true, "Please provide an author"],
      maxlength: [300, "Author name cannot be more than 50 characters"],
    },
    content: {
      type: String,
      required: [true, "Please provide content"],
    },
    embedding: {
      type: [Number],
      default: undefined,
    },
    url: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    validateBeforeSave: true,
  }
);

export default mongoose.models.Article ||
  mongoose.model("Article", ArticleSchema);
