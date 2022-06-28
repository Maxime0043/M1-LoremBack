const { Article } = require("../database/models/Article.model");
const { RequestState } = require("../database/enum");
const Joi = require("joi");

/**
 * Get all articles
 */
exports.getAll = async function (req, res) {
  const articles = await Article.find();
  res.status(200).json(articles);
};

/**
 * Create a new article
 */
exports.create = async function (req, res) {
  const payload = req.body;
  const user = req.user;
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    image: Joi.string().min(2).required(),
    content: Joi.string().min(50).required(),
  });

  const { value: article, error } = schema.validate(payload);
  if (error) return res.status(400).json({ error: error.details[0].message });

  Article.create(
    {
      ...article,
      id_author: user.id,
    },
    function (_, article) {
      // saved!
      res.status(201).json(article);
    }
  );
};

/**
 * Get an article by id
 */
exports.get = async function (req, res) {
  const { id } = req.params;
  const article = await Article.findById(id);
  if (!article) return res.status(400).json({ error: "Invalid Article Id !" });

  res.status(200).json(article);
};

/**
 * Update an article by id
 */
exports.update = async function (req, res) {
  const { id } = req.params;
  const payload = req.body;
  const user = req.user;
  const schema = Joi.object({
    title: Joi.string().min(3),
    image: Joi.string().min(2),
    content: Joi.string().min(50),
    published: Joi.string().valid(...Object.values(RequestState)),
  }).min(1);

  const { value: newArticle, error } = schema.validate(payload);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const oldArticle = await Article.findById(id);

  if (!oldArticle)
    return res.status(400).json({ error: "Invalid Article Id !" });
  if (oldArticle.id_author.toString() !== user.id)
    return res
      .status(400)
      .json({ error: "User is not the owner of the article !" });

  const article = await oldArticle.updateOne(newArticle);
  res.status(200).json(await Article.findById(id));
};

/**
 * Delete an article by id
 */
exports.delete = async function (req, res) {
  const { id } = req.params;
  const user = req.user;

  const article = await Article.findById(id);
  if (!article) return res.status(400).json({ error: "Invalid Article Id !" });
  if (article.id_author.toString() !== user.id)
    return res
      .status(400)
      .json({ error: "User is not the owner of the article !" });

  const result = await article.delete();
  res.status(200).json(result);
};
