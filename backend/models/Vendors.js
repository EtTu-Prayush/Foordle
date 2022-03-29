const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VendorSchema = new Schema({
  managername: {
    type: String,
    required: true,
  },
  shopname: {
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
  opentime: {
    type: String,
    required: true,
  },
  closetime: {
    type: String,
    required: true,
  },
  placedorders: {
    type: Number,
    required: true,
    default: 0,
  },
  pendingorders: {
    type: Number,
    required: true,
    default: 0,
  },
  completedorders: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = Vendor = mongoose.model("Vendors", VendorSchema);
