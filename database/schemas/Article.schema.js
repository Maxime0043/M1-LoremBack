const mongoose = require("mongoose");
const { RequestState } = require("../enum");

module.exports.ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: null,
  },
  published_at: {
    type: Date,
    default: null,
  },
  published: {
    type: String,
    enum: RequestState,
    default: RequestState.NOT_PUBLISHED,
    required: true,
  },
  id_group: {
    type: mongoose.ObjectId,
    ref: "Group",
    default: null,
  },
  id_author: {
    type: mongoose.ObjectId,
    ref: "User",
    required: true,
  },
});
