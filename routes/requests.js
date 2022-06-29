const express = require("express");
const {
  authGuardAuthor,
} = require("../middlewares/authGuardAuthor.middleware");
const Resquest = require("../controllers").request;
const router = express.Router();

// Example how to use a controller

router.post("/", [authGuardAuthor], Resquest.create);

module.exports = router;
