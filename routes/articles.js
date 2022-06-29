const express = require("express");
const Article = require("../controllers").article;
const {
  authGuardAuthor,
} = require("../middlewares/authGuardAuthor.middleware");
const { validId } = require("../middlewares/validId.middleware");
const router = express.Router();

router.post("/", [authGuardAuthor], Article.create);
router.get("/", Article.getAll);

router.get("/:id", [validId], Article.get);
router.put("/:id", [validId, authGuardAuthor], Article.update);
router.delete("/:id", [validId, authGuardAuthor], Article.delete);

module.exports = router;
