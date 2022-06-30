// Import models + enums
const { User } = require("../database/models/User.model");
const { Role } = require("../database/enum");
const ObjectID = require("mongoose").Types.ObjectId;

// JWT + dotenv
const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * Middleware that checks if the user is an author.
 */
module.exports.authGuardAuthor = async (req, res, next) => {
  const authHeader = req.header("authorization");
  const token = authHeader && authHeader.split(" ")[1];

  // If the user is not connected
  if (!token) {
    return res.status(401).json({ error: "You need to be connected !" });
  }

  // We decode the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    const decodedUser = decoded;
    req.user = decoded;

    if (ObjectID.isValid(decodedUser.id)) {
      const user = await User.findById(decodedUser.id);

      if (user.role === Role.AUTHOR) next();
      else res.status(400).json({ error: "The user must be an author !" });
    } else {
      res.status(400).json({ error: "Id must be valid !" });
    }
  } catch (err) {
    return res.status(400).json({ error: "Invalid Token !" });
  }
};
