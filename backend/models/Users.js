const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: false,
  },
  user_type: {
    type: String,
    default: "buyer"
  }
});


module.exports = User = mongoose.model("Users", UserSchema);
