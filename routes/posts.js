// facebook-clone-backend/routes/posts.js

const router = require("express").Router();
const Post = require("../models/Post");
const jwt = require("jsonwebtoken");

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json("Access denied");

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json("Invalid token");
  }
};

// Create Post
router.post("/create", verifyToken, async (req, res) => {
  try {
    const newPost = new Post({
      userId: req.user.id,
      content: req.body.content,
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get All Posts
router.get("/all", async (req, res) => {
  try {
    const posts = await Post.find().populate("userId", "username").sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
