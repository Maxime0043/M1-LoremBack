const ObjectID = require("mongoose").Types.ObjectId;

module.exports.validId = async (req, res, next) => {
  const { id } = req.params;

  if (ObjectID.isValid(id)) next();
  else return res.status(400).json({ error: "Invalid Id !" });
};
