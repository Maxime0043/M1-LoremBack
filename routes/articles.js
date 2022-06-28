const express = require("express");
const Article = require("../controllers").article;
const { authGuard } = require("../middlewares/auth.middleware");
const { validId } = require("../middlewares/validId.middleware");
const router = express.Router();

router.post("/", [authGuard], Article.create);
router.get("/", Article.getAll);

router.get("/:id", [validId], Article.get);
router.put("/:id", [validId, authGuard], Article.update);
router.delete("/:id", [validId, authGuard], Article.delete);

module.exports = router;
