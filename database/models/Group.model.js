const mongoose = require("mongoose");
const { GroupSchema } = require("../schemas/Group.schema");

module.exports.Group = mongoose.model("Group", GroupSchema);
