const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    require: true,
  },
  cloudinaryId: {
    type: String,
    require: true,
  },
  caption: {
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
  author: { type: Schema.Types.ObjectId, ref: 'User' } // Ensure this line is present
});

//MongoDB Collection named here (Post) - will give lowercase plural of name
module.exports = mongoose.model("Post", PostSchema); 
