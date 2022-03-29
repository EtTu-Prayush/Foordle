const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BuyerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    //unique
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  contact: {
    type: Number,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  batch: {
    type: Number, //0 1 2 3 4 5 6 //UG1 UG2 UG3 UG4 UG5 PG1 PG2
    required: true,
  },
  wallet: {
    type: Number,
    required: true,
    default: 0,
  },
  favourites: [
    {
        type: String,
        default: [],
    }
  ]
});

module.exports = Buyer = mongoose.model("Buyers", BuyerSchema);
