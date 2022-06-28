// Import models
const { Group } = require("../database/models/Group.model");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.validGroup = async (req, res, next) => {
  const params = req.params;
  let id = params.id;

  // Verification
  if (ObjectID.isValid(id)) {
    const group = await Group.findById(id);

    if (group) next();
    else res.status(400).json({ error: "Id must exists !" });
  }

  // Else
  else {
    res.status(400).json({ error: "Id must exists !" });
  }
};
