const express = require("express");

const {
  createPost,
  deletePost,
  updatePost,
  getAllPosts,
  getOnePost,
  loadingImage,
  updateImage,
} = require("./../controllers/postsController");

const router = express.Router();

router.route("/").post(loadingImage, createPost).get(getAllPosts);
router
  .route("/:id")
  .delete(deletePost)
  .patch(loadingImage, updatePost)
  .get(getOnePost);

module.exports = router;
