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

module.exports.editorsGroup = async (req, res, next) => {
  const editor = req.user;
  const groupId = req.params.id;
  const group = await Group.findById(groupId);

  // If the group exists
  if (group) {
    // We check that the group belongs to the user
    if (group.id_editor.toString() === editor.id) next();
    else res.status(400).json({ error: "You do not own the group !" });
  }
  // Else
  else {
    res.status(400).json({ error: "Id must exists !" });
  }
};
