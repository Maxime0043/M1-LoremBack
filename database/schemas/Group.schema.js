const mongoose = require("mongoose");

module.exports.GroupSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  articles: [
    {
      type: mongoose.ObjectId,
      ref: "Article",
    },
  ],
  id_editor: {
    type: mongoose.ObjectId,
    ref: "User",
    required: true,
  },
});
