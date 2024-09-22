const mongoose = require("mongoose");


const CommentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    required: true,
  },
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipe",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likedBy: [{
    type: String,
    required: true,
  }],
  replies: [{
    comment: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    likedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
  }],
});

module.exports = mongoose.model("Comment", CommentSchema); 