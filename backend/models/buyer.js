const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// schema for the buyer //s

const buyer_schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  contact_number: {
    type: String,
    required: true,
  },
  batch_name: {
    type: String,
    required: true,
    // enum: ["UG1", "UG2", "UG3", "UG4", "UG5"],
  },
  age: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  wallet: {
    type: Number,
    // required: false,
    default: 0,
  },
  user_type: {
    type: String,
    default: "buyer"
  }
});

module.exports = buyer = mongoose.model("buyers", buyer_schema);
