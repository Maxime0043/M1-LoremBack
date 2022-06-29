const express = require("express");
const { authGuard } = require("../middlewares/auth.middleware");
const { validEditor } = require("../middlewares/user.middleware");
const {
  authGuardAuthor,
} = require("../middlewares/authGuardAuthor.middleware");
const Request = require("../controllers").request;
const router = express.Router();

router.post("/", [authGuardAuthor], Request.create);

router.get("/", [authGuard], Request.getAll);

router.post("/:id/valid", [authGuard, validEditor], Request.valid);

module.exports = router;
