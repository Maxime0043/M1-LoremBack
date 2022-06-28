// JWT + dotenv
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Middleware to verify a user's connection
module.exports.authGuard = async (req, res, next) => {
  const authHeader = req.header("authorization");
  const token = authHeader && authHeader.split(" ")[1];

  // If the user is not connected
  if (!token) {
    return res.status(401).json({ error: "You need to be connected !" });
  }

  // We decode the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    req.user = decoded;

    // The middleware has done its job and can make way for the next one.
    next();
  } catch (err) {
    return res.status(400).json({ error: "Invalid Token !" });
  }
};
