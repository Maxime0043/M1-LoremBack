// Import models
const { Group } = require("../database/models/Group.model");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.validGroup = async (req, res, next) => {
  const params = req.params;
  const id = params.id || params.groupId;

  // Verification
  if (ObjectID.isValid(id)) {
    const group = await Group.findById(id);

    if (group) next();
    else res.status(400).json({ error: "Group Id must exists !" });
  } else {
    res.status(400).json({ error: "Group Id must exists !" });
  }
};

module.exports.editorsGroup = async (req, res, next) => {
  const editor = req.user;
  const groupId = req.params.id || req.params.groupId;
  const group = await Group.findById(groupId);

  // We check that the group belongs to the user
  if (group.id_editor.toString() === editor.id) next();
  else res.status(400).json({ error: "You do not own the group !" });
};
