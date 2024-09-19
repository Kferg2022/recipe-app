const Comment = require("../models/Comment");
const Recipe = require("../models/Recipe");

module.exports = {
  createComment: async (req, res) => {
    try {
      await Comment.create({
        comment: req.body.comment,
        likes: 0,
        user: req.user.id,
        recipe: req.params.id,
      });
      console.log("Comment has been added!");
      res.redirect("/recipe/"+req.params.id);
    } catch (err) {
      console.log(err);
    }
  },
likeComment: async (req, res) => {
    try {
      const comment = await Comment.findById(req.params.id);
      if (!comment) {
        return res.status(404).json({ success: false, error: "Comment not found" });
      }

      // Check if the user has already liked the comment
      const likedIndex = comment.likedBy.indexOf(req.user.id);
      if (likedIndex > -1) {
        // User has already liked, so unlike
        comment.likedBy.splice(likedIndex, 1);
        comment.likes--;
      } else {
        // User hasn't liked, so add like
        comment.likedBy.push(req.user.id);
        comment.likes++;
      }

      await comment.save();
      res.json({ success: true, likes: comment.likes });
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, error: "Server error" });
    }
  },  
  unlikeComment: async (req, res) => {
    try {
      const comment = await Comment.findById(req.params.id);
      if (comment.likedBy.includes(req.user.id)) {
        await Comment.findOneAndUpdate(
          { _id: req.params.id },
          {
            $inc: { likes: -1 },
            $pull: { likedBy: req.user.id }
          }
        );
        console.log("Unliked comment");
      }
      res.redirect(`/recipe/${req.params.id}`);
    } catch (err) {
      console.log(err);
    } 
  },  
  createReply: async (req, res) => {
    try {
      const parentComment = await Comment.findById(req.params.commentId);
      if (!parentComment) {
        return res.status(404).send("Parent comment not found");
      }

      const newReply = await Comment.create({
        comment: req.body.reply,
        likes: 0,
        user: req.user.id,
        recipe: req.params.recipeId,
        parentComment: req.params.commentId,
      });
      
      parentComment.replies.push(newReply._id);
      await parentComment.save();
      
      console.log("Reply has been added!");
      res.redirect("/recipe/" + req.params.recipeId);
    } catch (err) {
      console.error("Error in createReply:", err);
      res.status(500).send("Error creating reply: " + err.message);
    }
  },
  deleteComment: async (req, res) => {
    try {
      const comment = await Comment.findById(req.params.id);
      if (!comment) {
        return res.status(404).send("Comment not found");
      }
      if (comment.user.toString() !== req.user.id) {
        return res.status(401).send("Unauthorized");
      }
      
      const recipe = await Recipe.findById(comment.recipe);
      if (!recipe) {
        return res.status(404).send("Recipe not found");
      }

      if (comment.parentComment) {
        // It's a reply, remove it from the parent comment's replies array
        await Comment.findByIdAndUpdate(comment.parentComment, {
          $pull: { replies: comment._id }
        });
      } else {
        // It's a top-level comment, delete all its replies
        await Comment.deleteMany({ parentComment: comment._id });
      }
      
      await Comment.findByIdAndDelete(comment._id);
      console.log("Comment deleted successfully");
      res.redirect("/recipe/" + recipe._id);
    } catch (err) {
      console.error("Error in deleteComment:", err);
      res.status(500).send("Error deleting comment: " + err.message);
    }
  }
};
