// Import Model
const { Group } = require("../database/models/Group.model");

/**
 * Allows you to retrieve all groups of editors.
 */
exports.getAll = async function (req, res) {
  res.status(200).json(await Group.find({}));
};

/**
 * Allows you to retrieve one group.
 */
exports.get = async function (req, res) {
  const groupId = req.params.id;
  res.status(200).json(await Group.findById(groupId));
};

/**
 * Allows you to retrieve all the groups of an editor.
 */
exports.getFromEditor = async function (req, res) {
  const editorId = req.params.id;
  res.status(200).json(await Group.find({ id_editor: editorId }));
};
