const Post = require("../models/postModel");
const multer = require("multer");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mine type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

exports.loadingImage = multer({ storage: storage }).single("image");

exports.getAllPosts = async (req, res, next) => {
  const posts = await Post.find();

  res.status(200).json({
    message: "posts fetched successfully",
    posts,
  });
};

exports.getOnePost = async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (post) {
    res.status(200).json({
      message: "post fetched successfully",
      post,
    });
  } else {
    res.status(404).json({
      message: "post not found",
    });
  }
};

exports.createPost = async (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const newPost = await Post.create({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
  });

  res.status(201).json({
    message: "post added successfully",
    post: newPost,
  });
};

exports.deletePost = async (req, res, next) => {
  const post = await Post.findByIdAndDelete(req.params.id);

  res.status(200).json({
    message: "post deleted successfully",
  });
};

exports.updatePost = async (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    imagePath =
      req.protocol + "://" + req.get("host") + "/images/" + req.file.filename;
  }

  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { ...req.body, imagePath },
    {
      new: true,
      runValidators: true,
    },
  );
  res.status(200).json({
    message: "post updated successfully",
    post,
  });
};
