const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tag_schema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

module.exports = tag = mongoose.model("tag", tag_schema);
