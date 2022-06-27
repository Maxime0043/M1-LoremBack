const express = require("express");
const User = require("../controllers").user;
const router = express.Router();

// Example how to use a controller

router.post("/", User.register);

module.exports = router;
