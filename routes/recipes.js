const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const recipesController = require("../controllers/recipes");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Post Routes - simplified for now

router.get("/:id", ensureAuth, recipesController.getRecipe);

router.get("/editRecipe/:id", ensureAuth, recipesController.getEditRecipe);

//Enables user to create post w/ cloudinary for media uploads
router.post("/createRecipe", upload.single("file"), recipesController.createRecipe)
  
//Enables user to like post. In controller, uses POST model to update likes by 1
router.put('/likeRecipe/:id', recipesController.likeRecipe);

router.put("/unlikeRecipe/:id", recipesController.unlikeRecipe);

router.put("/updateRecipe/:id", ensureAuth, upload.single("file"), recipesController.updateRecipe);


//Enables user to delete post. In controller, uses POST model to delete post from MongoDB collection
router.delete("/deleteRecipe/:id", recipesController.deleteRecipe);

module.exports = router;