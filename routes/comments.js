const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/comments");
const { ensureAuth } = require("../middleware/auth");



router.post("/createComment/:recipeId", ensureAuth, commentsController.createComment);
router.put("/likeComment/:commentId", ensureAuth, commentsController.likeComment);
router.delete("/deleteComment/:commentId/:recipeId", ensureAuth, commentsController.deleteComment);

router.post("/createReply/:recipeId/:commentId", ensureAuth, commentsController.createReply);
router.put("/likeReply/:commentId/:replyId", ensureAuth, commentsController.likeReply);
router.delete("/deleteReply/:replyId/:commentId/:recipeId", ensureAuth, commentsController.deleteReply);


module.exports = router;