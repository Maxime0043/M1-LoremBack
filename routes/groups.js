const express = require("express");
const Group = require("../controllers").group;
const router = express.Router();

// Example how to use a controller

router.post("/", Group.create);

module.exports = router;
