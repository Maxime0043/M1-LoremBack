const express = require("express");
const User = require("../controllers").user;
const { authGuard } = require("../middlewares/auth.middleware");
const router = express.Router();

router.get("/account", [authGuard], User.account);
router.post("/register", User.register);
router.post("/login", User.login);

module.exports = router;
