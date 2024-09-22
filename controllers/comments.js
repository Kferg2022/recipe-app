const Comment = require("../models/Comment");
const Recipe = require("../models/Recipe");
 


   module.exports = {
    createComment: async (req, res) => {
      try {
          await Comment.create({
              comment: req.body.comment,
              likes: 0,
              recipe: req.params.recipeId,  // Change this line
              user: req.user.id,
              likedBy: [],
          });
          console.log("Comment has been added!");
          res.redirect("/recipe/" + req.params.recipeId);  // Also update here if necessary
      } catch (err) {
          console.log(err);
          res.status(500).send("Error adding comment");
      }
  },  
    likeComment: async (req, res) => {
      try {
          const comment = await Comment.findById(req.params.commentId);
          if (!comment) {
              return res.status(404).send("Comment not found");
          }
  
          const userId = req.user.id; // Assuming this is a string
  
          console.log("User ID:", userId); // Log User ID
          console.log("LikedBy before:", comment.likedBy); // Log likedBy array before
  
          if (comment.likedBy.includes(userId)) {
              // User already liked the comment, so we unlike it
              comment.likes -= 1;
              comment.likedBy = comment.likedBy.filter(id => id !== userId); // Remove user ID from likedBy
              console.log("Unliked comment");
          } else {
              // User hasn't liked the comment yet, so we like it
              comment.likes += 1;
              comment.likedBy.push(userId); // Add user ID to likedBy
              console.log("Liked comment");
          }
  
          await comment.save(); // Save changes
          console.log("LikedBy after:", comment.likedBy); // Log likedBy array after
          res.redirect(`/recipe/${comment.recipe}`);
      } catch (err) {
          console.error(err);
          res.status(500).send("Error processing like/unlike");
      }
  },   
  deleteComment: async (req, res) => {
    try {
        const commentId = req.params.commentId; // Ensure this is the ID of the comment to delete
        const recipeId = req.params.recipeId; // Get the recipe ID

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).send("Comment not found");
        }
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).send("Unauthorized");
        }

        await Comment.findOneAndDelete({ _id: commentId });
        console.log("Deleted Comment");
        res.redirect(`/recipe/${recipeId}`);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error deleting comment");
    }
},
    createReply: async (req, res) => {
      try {
        const parentComment = await Comment.findById(req.params.commentId);
        if (!parentComment) {
          return res.status(404).send("Parent comment not found");
        }
  
        const newReply = {
          comment: req.body.reply,
          likes: 0,
          user: req.user.id,
          likedBy: [],
        };
  
        parentComment.replies.push(newReply);
        await parentComment.save();
  
        console.log("Reply has been added!");
        res.redirect("/recipe/" + req.params.recipeId);
      } catch (err) {
        console.log(err);
        res.status(500).send("Server error");
      }
    },
    likeReply: async (req, res) => {
      try {
          const { commentId, replyId } = req.params;
          const comment = await Comment.findById(commentId);
  
          if (!comment) {
              return res.status(404).send("Comment not found");
          }
  
          const reply = comment.replies.id(replyId);
          if (!reply) {
              return res.status(404).send("Reply not found");
          }
  
          const userId = req.user.id;
          if (reply.likedBy.includes(userId)) {
              // User already liked the reply, so we unlike it
              reply.likes -= 1;
              reply.likedBy.pull(userId);  // Remove user ID from likedBy
              console.log("Unliked reply");
          } else {
              // User hasn't liked the reply yet, so we like it
              reply.likes += 1;
              reply.likedBy.push(userId);  // Add user ID to likedBy
              console.log("Liked reply");
          }
          
          await comment.save();  // Save changes
          res.redirect(`/recipe/${comment.recipe}`);
      } catch (err) {
          console.log(err);
          res.status(500).send("Error processing like/unlike");
      }
  },
  
  deleteReply: async (req, res) => {
    try {
        const { replyId, commentId, recipeId } = req.params;

        // Find the comment that contains the reply
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).send("Comment not found");
        }

        // Check if the reply exists and is owned by the user
        const replyIndex = comment.replies.findIndex(reply => reply._id.toString() === replyId);
        if (replyIndex === -1) {
            return res.status(404).send("Reply not found");
        }
        
        if (comment.replies[replyIndex].user.toString() !== req.user.id) {
            return res.status(401).send("Unauthorized");
        }

        // Remove the reply
        comment.replies.splice(replyIndex, 1);
        await comment.save();

        console.log("Deleted Reply");
        res.redirect(`/recipe/${recipeId}`);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error deleting reply");
    }
},

  }; 