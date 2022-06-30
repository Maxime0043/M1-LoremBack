// Import models + enums
const { User } = require("../database/models/User.model");
const { Role } = require("../database/enum");

module.exports.validEditor = async (req, res, next) => {
  const id = req.user.id;
  const user = await User.findById(id);

  req.editorId = req.user.id;

  if (user) {
    if (user.role === Role.EDITOR) next();
    else res.status(400).json({ error: "The user must be an editor !" });
  } else res.status(400).json({ error: "Id must exists !" });
};
