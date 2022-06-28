const express = require("express");
const Group = require("../controllers").group;
const router = express.Router();

router.get("/", Group.getAll);

module.exports = router;
