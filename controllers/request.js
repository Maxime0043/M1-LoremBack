const { Request } = require("../database/models/Request.model");
const { Article } = require("../database/models/Article.model");
const { Group } = require("../database/models/Group.model");
const Joi = require("joi");
const { Role, RequestState } = require("../database/enum");
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

/**
 * Validate a request
 */
exports.valid = async function (req, res) {
  const { id } = req.params;
  const user = req.user;

  if (ObjectID.isValid(id)) {
    const request = await Request.findById(id);

    let group = await Group.findById(request.id_group);

    if (group.id_editor.toString() === user.id) {
      const article = await Article.findByIdAndUpdate(
        request.id_article.toString(),
        {
          published: RequestState.PUBLISHED,
          id_group: request.id_group.toString(),
          published_at: Date.now(),
        }
      );

      group = await Group.findByIdAndUpdate(request.id_group.toString(), {
        articles: [...group.articles, request.id_article.toString()],
      });

      return res.status(200).json(await request.delete());
    } else
      return res
        .status(400)
        .json({ error: "User is not the owner of the group !" });
  } else return res.status(400).json({ error: "Request ID invalid !" });
};

/**
 * Cancel a request (Author user)
 */
exports.cancel = async function (req, res) {
  const { id } = req.params;
  const user = req.user;

  if (ObjectID.isValid(id)) {
    const request = await Request.findById(id);

    let article = await Article.findById(request.id_article);

    if (article.id_author.toString() === user.id) {
      await article.updateOne({
        published: RequestState.NOT_PUBLISHED,
      });
      return res.status(200).json(await request.delete());
    } else
      return res
        .status(400)
        .json({ error: "User is not the owner of the article !" });
  } else return res.status(400).json({ error: "Request ID invalid !" });
};

/**
 * Refuse a request (Editor user)
 */
exports.refuse = async function (req, res) {
  const { id } = req.params;
  const user = req.user;

  if (ObjectID.isValid(id)) {
    const request = await Request.findById(id);

    let group = await Group.findById(request.id_group);

    if (group.id_editor.toString() === user.id) {
      await Article.findByIdAndUpdate(request.id_article.toString(), {
        published: RequestState.NOT_PUBLISHED,
      });
      return res.status(200).json(await request.delete());
    } else
      return res
        .status(400)
        .json({ error: "User is not the owner of the group !" });
  } else return res.status(400).json({ error: "Request ID invalid !" });
};
