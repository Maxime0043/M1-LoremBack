const express = require("express");
const Group = require("../controllers").group;
const { authGuard } = require("../middlewares/auth.middleware");
const { validGroup, editorsGroup } = require("../middlewares/group.middleware");
const { validEditor } = require("../middlewares/user.middleware");
const router = express.Router();

router.get("/", Group.getAll);
router.get("/:id", [validGroup], Group.get);
router.get("/editor/:id", [validEditor], Group.getFromEditor);

router.post("/", [authGuard], Group.create);
router.post(
  "/:id/article",
  [authGuard, validGroup, editorsGroup],
  Group.insertArticle
);

router.put("/:id", [authGuard, validGroup, editorsGroup], Group.update);

module.exports = router;
