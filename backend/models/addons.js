const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const addon_schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

module.exports = addons = mongoose.model("addons", addon_schema);
