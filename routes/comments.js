/* const express = require('express')
const router = express.Router();
const commentsController = require('../controllers/comments');
const {ensureAuth, ensureGuest} = require('../middleware/auth');
 */
//Comment Routes
/* router.post('/createComment/:recipeId', commentsController.createComment);
router.put("/likeComment/:id", ensureAuth, commentsController.likeComment);
router.post("/createReply/:recipeId/:commentId", ensureAuth, commentsController.createReply);
module.exports = router; */

const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/comments");
const { ensureAuth } = require("../middleware/auth");

router.post("/createComment/:id", ensureAuth, commentsController.createComment);
router.put("/likeComment/:id", ensureAuth, commentsController.likeComment);
router.put("/unlikeComment/:id", ensureAuth, commentsController.unlikeComment);
router.post("/createReply/:recipeId/:commentId", ensureAuth, commentsController.createReply);
router.delete("/deleteComment/:id", ensureAuth, commentsController.deleteComment);

module.exports = router;