const joi = require("joi");

// Import Model + enums
const { Group } = require("../database/models/Group.model");
const { Article } = require("../database/models/Article.model");

/**
 * Allows you to retrieve all groups of editors.
 */
exports.getAll = async function (req, res) {
  res.status(200).json(await Group.find({}).populate("articles"));
};

/**
 * Allows you to retrieve one group.
 */
exports.get = async function (req, res) {
  const groupId = req.params.id;
  res.status(200).json(await Group.findById(groupId).populate("articles"));
};

/**
 * Allows you to retrieve all the groups of an editor.
 */
exports.getFromEditor = async function (req, res) {
  const editorId = req.editorId;
  res
    .status(200)
    .json(await Group.find({ id_editor: editorId }).populate("articles"));
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

/**
 * Allows you to edit a group.
 */
exports.update = async function (req, res) {
  const groupId = req.params.id;
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
    // Update the group
    let group = await Group.findByIdAndUpdate(groupId, value);
    group = await Group.findById(groupId);

    // Returns updated object
    res.status(200).json(group);
  }
};

/**
 * Allows you to add an article to a group.
 */
exports.insertArticle = async function (req, res) {
  const groupId = req.params.id;
  const payload = req.body;

  // Validation
  const schema = joi.object({
    id_article: joi.string().min(1).required(),
  });
  const { value, error } = schema.validate(payload);

  // If the fields have been filled in incorrectly
  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  } else {
    const articleId = value.id_article;
    const article = await Article.findByIdAndUpdate(articleId, {
      id_group: groupId,
    });

    // If the update has been performed
    if (article) {
      let group = await Group.findById(groupId);
      group = await Group.findByIdAndUpdate(groupId, {
        articles: [...group.articles, articleId],
      });
      group = await Group.findById(groupId);

      res.status(200).json(group);
    }
    // Else
    else {
      res.status(400).json({ error: "Article Id must exists !" });
    }
  }
};
