const cloudinary = require("../middleware/cloudinary");
const moment = require('moment');
const Recipe = require("../models/Recipe");
const Comment = require('../models/Comment');
const mongoose = require('mongoose')

module.exports = {
  getProfile: async (req, res) => {
    try {
      // Grab recipes of logged in user
      const recipes = await Recipe.find({ user: req.user.id });
    //Sending recipe data from mongodb and user data to ejs template
    res.render("profile.ejs", { recipes: recipes, user: req.user });
  } catch (err) {
    console.log(err);
  }
  },
  getFeed: async (req, res) => {
    try {
      const recipes = await Recipe.find()
        .sort({ createdAt: 'desc' })
        .lean()
        .populate('user', 'userName')  // Populate the user field and only fetch the userName

      res.render('feed.ejs', { recipes: recipes, user: req.user })
    } catch (err) {
      console.log(err)
      res.render('error/500')
    }
  },
  getRecipe: async (req, res) => {
    try {
      const recipe = await Recipe.findById(req.params.id).populate("user");
      const comments = await Comment.find({ recipe: req.params.id })
        .sort({ createdAt: 1 })
        .populate("user")
        .populate("likedBy")
        .populate({
          path: "replies",
          populate: {
            path: "user",
          },
        });

      res.render("recipe.ejs", { recipe: recipe, user: req.user, comments: comments, moment: require('moment') });
    } catch (err) {
      console.log(err);
      res.redirect("/profile");
    }
  },
 createRecipe: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
      //media is stored on cloudinary - the above request responds with url to media and the media id that you will need when deleting content
      await Recipe.create({
        name: req.body.name,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        comments: req.body.comments,
        directions: req.body.directions,
        ingredients: req.body.ingredients, 
        prepTime: req.body.prepTime,
        cookTime: req.body.cookTime,
        servings: req.body.servings,
        likes: 0,
        user: req.user.id,
      });
      console.log("Recipe has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  }, 
  likeRecipe: async (req, res) => {
    try {
      const recipe = await Recipe.findById(req.params.id);
      if (!recipe.likedBy.includes(req.user.id)) {
        await Recipe.findOneAndUpdate(
          { _id: req.params.id },
          {
            $inc: { likes: 1 },
            $push: { likedBy: req.user.id }
          }
        );
        console.log("Liked recipe");
      }
      res.redirect(`/recipe/${req.params.id}`);
    } catch (err) {
      console.log(err);
    } 
  },
  unlikeRecipe: async (req, res) => {
    try {
      const recipe = await Recipe.findById(req.params.id);
      if (recipe.likedBy.includes(req.user.id)) {
        await Recipe.findOneAndUpdate(
          { _id: req.params.id },
          {
            $inc: { likes: -1 },
            $pull: { likedBy: req.user.id }
          }
        );
        console.log("Unliked recipe");
      }
      res.redirect(`/recipe/${req.params.id}`);
    } catch (err) {
      console.log(err);
    } 
  },
  getEditRecipe: async (req, res) => {
    try {
      const recipe = await Recipe.findById(req.params.id);
      if (recipe.user != req.user.id) {
        return res.redirect("/profile");
      }
      res.render("editRecipe.ejs", { recipe: recipe });
    } catch (err) {
      console.log(err);
    }
  },
  updateRecipe: async (req, res) => {
    try {
      console.log("Updating recipe:", req.params.id);
      console.log("Request body:", req.body);
  
      const recipe = await Recipe.findById(req.params.id);
      if (!recipe) {
        console.log("Recipe not found");
        return res.redirect("/profile");
      }
      if (recipe.user.toString() !== req.user.id) {
        console.log("Unauthorized");
        return res.redirect("/profile");
      }
  
      let result;
      if (req.file) {
        // Delete old image from cloudinary
        await cloudinary.uploader.destroy(recipe.cloudinaryId);
        // Upload new image to cloudinary
        result = await cloudinary.uploader.upload(req.file.path);
      }
  
      const updatedRecipe = {
        name: req.body.name,
        image: result?.secure_url || recipe.image,
        cloudinaryId: result?.public_id || recipe.cloudinaryId,
        ingredients: req.body.ingredients.split('\n').map(item => item.trim()).filter(item => item !== ''),
        directions: req.body.directions.split('\n').map(item => item.trim()).filter(item => item !== ''),
        prepTime: req.body.prepTime,
        cookTime: req.body.cookTime,
        servings: req.body.servings,
      };
  
      const updatedRecipeDoc = await Recipe.findOneAndUpdate(
        { _id: req.params.id },
        updatedRecipe,
        { new: true }
      );
  
      console.log("Recipe updated:", updatedRecipeDoc);
      res.redirect(`/recipe/${req.params.id}`);
    } catch (err) {
      console.error("Error updating recipe:", err);
      res.redirect("/profile");
    }
  },
  deleteRecipe: async (req, res) => {
    try {
      // Find recipe by id
      let recipe = await Recipe.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(recipe.cloudinaryId);
      // Delete post from db
      await Recipe.findByIdAndDelete({ _id: req.params.id });
      console.log("Deleted Recipe");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
}
