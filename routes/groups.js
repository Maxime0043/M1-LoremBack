const express = require("express");
const Group = require("../controllers").group;
const { validGroup } = require("../middlewares/group.middleware");
const router = express.Router();

router.get("/", Group.getAll);
router.get("/:id", [validGroup], Group.get);

module.exports = router;
