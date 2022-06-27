const mongoose = require("mongoose");

module.exports.RequestSchema = new mongoose.Schema({
  id_article: {
    type: mongoose.ObjectId,
    ref: "Article",
    required: true,
  },
  id_group: {
    type: mongoose.ObjectId,
    ref: "Group",
    required: true,
  },
  requested_at: {
    type: Date,
    default: Date.now,
    required: true,
  },
});
