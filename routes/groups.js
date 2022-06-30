const express = require("express");
const Group = require("../controllers").group;
const { authGuard } = require("../middlewares/auth.middleware");
const { validGroup, editorsGroup } = require("../middlewares/group.middleware");
const { validArticle } = require("../middlewares/article.middleware");
const { validEditor } = require("../middlewares/user.middleware");
const router = express.Router();

router.get("/", Group.getAll);
router.get("/editor", [authGuard, validEditor], Group.getFromEditor);
router.get("/:id", [validGroup], Group.get);
router.get("/:id/article", [validGroup], Group.getArticles);

router.post("/", [authGuard], Group.create);

router.put("/:id", [authGuard, validGroup, editorsGroup], Group.update);

router.delete(
  "/:groupId/article/:articleId",
  [authGuard, validGroup, validArticle],
  Group.deleteArticle
);
router.delete("/:id", [authGuard, validGroup, editorsGroup], Group.delete);

module.exports = router;
