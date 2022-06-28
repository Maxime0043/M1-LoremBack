const { Article } = require("../database/models/Article.model");

exports.getAll = async function (req, res) {
  const articles = await Article.find();
  res.status(200).json(articles);
};
