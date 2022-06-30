const joi = require("joi");
const ObjectID = require("mongoose").Types.ObjectId;

// Import Model + enums
const { Group } = require("../database/models/Group.model");
const { Article } = require("../database/models/Article.model");
const { RequestState } = require("../database/enum");

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
 * Allows you to retrieve all the articles in a group.
 */
exports.getArticles = async function (req, res) {
  const groupId = req.params.id;
  const group = await Group.findById(groupId).populate("articles");

  res.status(200).json(group.articles);
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
 * Allows you to delete a group.
 */
exports.delete = async function (req, res) {
  const groupId = req.params.id;
  const group = await Group.findById(groupId);

  group.articles.forEach(async (articleId) => {
    await Article.findByIdAndUpdate(articleId.toString(), {
      published: RequestState.IN_WAIT,
      id_group: null,
      published_at: null,
    });
  });

  const deletedGroup = await Group.findByIdAndDelete(groupId);

  res.status(200).json(deletedGroup);
};

/**
 * Allows you to delete an article from a group.
 */
exports.deleteArticle = async function (req, res) {
  const { groupId, articleId } = req.params;
  const group = await Group.findById(groupId);
  const articles = group.articles;

  await Group.findByIdAndUpdate(groupId, {
    articles: articles.filter(
      (currentId) => currentId.toString() !== articleId
    ),
  });

  let updatedArticle = await Article.findByIdAndUpdate(articleId, {
    published: RequestState.IN_WAIT,
    id_group: null,
    published_at: null,
  });

  updatedArticle = await Article.findById(articleId);

  res.status(200).json(updatedArticle);
};
