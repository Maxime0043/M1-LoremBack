const joi = require("joi");
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

/**
 * Allows you to create a group without articles.
 */
exports.create = async function (req, res) {
  const editor = req.user;
  const payload = req.body;

  // Validation
  const schema = joi.object({
    title: joi.string().min(3).required(),
  });
  const { value, error } = schema.validate(payload);

  // If the fields have been filled in incorrectly
  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  } else {
    // We fill in the missing data
    value.articles = [];
    value.id_editor = editor.id;

    // Creation of the group
    let group = new Group(value);
    group = await group.save();

    // Returns created object
    res.status(201).json(group);
  }
};
