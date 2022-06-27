const express = require("express");
const Article = require("../controllers").article;
const router = express.Router();

// Example how to use a controller

router.post("/", Article.create);

module.exports = router;
