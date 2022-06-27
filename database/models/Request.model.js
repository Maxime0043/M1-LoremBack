const mongoose = require("mongoose");
const { RequestSchema } = require("../schemas/Request.schema");

module.exports.Request = mongoose.model("Request", RequestSchema);
