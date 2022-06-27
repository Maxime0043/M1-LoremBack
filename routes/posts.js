const express = require("express");
const Post = require("../controllers").post;
const router = express.Router();

// Example how to use a controller

router.post("/", Post.create);

module.exports = router;
