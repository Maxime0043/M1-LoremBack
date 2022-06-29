// Import models
const { Article } = require("../database/models/Article.model");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.validArticle = async (req, res, next) => {
  const params = req.params;
  const id = params.id || params.articleId;

  // Verification
  if (ObjectID.isValid(id)) {
    const article = await Article.findById(id);

    if (article) next();
    else res.status(400).json({ error: "Article Id must exists !" });
  } else {
    res.status(400).json({ error: "Article Id must exists !" });
  }
};
