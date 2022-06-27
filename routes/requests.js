const express = require("express");
const Resquest = require("../controllers").request;
const router = express.Router();

// Example how to use a controller

router.post("/", Resquest.create);

module.exports = router;
