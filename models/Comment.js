const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    comment: {
        type: String,
        required: true,
        author: { type: Schema.Types.ObjectId, ref: 'User' }
      },
      likes: {
        type: Number,
        default: 0,
      },
      post: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
      },
      createdAt: {
        type: Date,
        default: Date.now,
      }
})




module.exports = mongoose.model('Comment', CommentSchema);

  
