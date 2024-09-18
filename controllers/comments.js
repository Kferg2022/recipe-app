const Comment = require('../models/Comment');
const Post = require('../models/Post');

exports.createComment = async (req, res, next) => {
  try {
    const { comment } = req.body;
    const { postId } = req.params;

    // Validate input
    if (!comment) {
      req.flash('errors', { msg: 'Comment cannot be empty.' });
      return res.redirect(`/post/${postId}`);
    }

    // Create a new comment
    const newComment = new Comment({
      comment,
      post: postId,
      author: req.user.id, // Assuming you have `req.user` populated
    });

    await newComment.save();

    // Optionally update the post to include the comment (if necessary)
    await Post.findByIdAndUpdate(postId, { $push: { comments: newComment._id } });

    req.flash('success', { msg: 'Comment added successfully!' });
    res.redirect(`/post/${postId}`);
  } catch (err) {
    next(err);
  }
};
