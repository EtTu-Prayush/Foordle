const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const food_schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  vendor_shop: {
    type: String,
    required: true,
  },
  vendor_email: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  food_type: {
    type: String,
    required: true,
  },
  addon_name: {
    type: [String],
    default: []
  },
  addon_price: {
    type: [Number],
    default: []
  },
  tags: {
    type: [String],
    default: []
  },

  num_ordered: {
    type: Number,
    default: 0
  },

  num_sold: {
    type: Number,
    default: 0
  },

  // store the number of ratings for each food item
  num_rated: {
    type: Number,
    default: 0
  }
});

module.exports = food = mongoose.model("food_item", food_schema);
