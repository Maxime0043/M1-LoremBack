const mongoose = require("mongoose");
const { ArticleSchema } = require("../schemas/Article.schema");

module.exports.Article = mongoose.model("Article", ArticleSchema);
