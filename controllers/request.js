const { Request } = require("../database/models/Request.model");
const { Article } = require("../database/models/Article.model");
const { Group } = require("../database/models/Group.model");
const Joi = require("joi");
const { Role } = require("../database/enum");
const ObjectID = require("mongoose").Types.ObjectId;

/**
 * Create a new request
 */
exports.create = async function (req, res) {
  const payload = req.body;

  const schema = Joi.object({
    id_article: Joi.string().required(),
    id_group: Joi.string().required(),
  });

  const { value: request, error } = schema.validate(payload);
  if (error) return res.status(400).json({ error: error.details[0].message });

  if (ObjectID.isValid(request.id_article)) {
    const article = await Article.findById(request.id_article);
    if (!article) return res.status(400).json({ error: "Article not found" });
  } else {
    return res.status(400).json({ error: "Article ID not valid !" });
  }

  if (ObjectID.isValid(request.id_group)) {
    const group = await Group.findById(request.id_group);
    if (!group) return res.status(400).json({ error: "Group not found" });
  } else {
    return res.status(400).json({ error: "Group ID not valid !" });
  }

  Request.create(request, function (_, request) {
    res.status(201).json(request);
  });
};

/**
 * Get all requests by user role
 */
exports.getAll = async function (req, res) {
  const user = req.user;

  console.log(user.role);

  if (user.role === Role.EDITOR) {
    const groups = await Group.find({ id_editor: user.id }, "id").exec();
    const tabGroups = groups.map((val) => val._id);
    const requests = await Request.find({
      id_group: { $in: tabGroups },
    }).exec();
    return res.status(200).json(requests);
  } else if (user.role === Role.AUTHOR) {
    const articles = await Article.find({ id_author: user.id }, "id").exec();
    const tabArticles = articles.map((val) => val._id);
    const requests = await Request.find({
      id_article: { $in: tabArticles },
    }).exec();
    return res.status(200).json(requests);
  } else {
    return res.status(400).json({ error: "User role not valid !" });
  }
};
