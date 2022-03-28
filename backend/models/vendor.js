const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Vendor Schema

const vendor_schema = new Schema({
  manager_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  shop_name: {
    type: String,
    required: true,
    unique: true,
  },
  contact_number: {
    type: String,
    required: true,
  },
  open_time: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  close_time: {
    type: String,
    required: true,
  },
  user_type: {
    type: String,
    default: "vendor"
  },
  // placed order details
  // to be increased from the buyer side when placing the order
  order_placed: {
    type: Number,
    default: 0
  },
  // order accepted and not delivered is pending order
  pending_order: {
    type: Number,
    default: 0
  },
  // completed order are basically the orders which are delivered
  completed_order: {
    type: Number,
    default: 0
  },
});

module.exports = vendor = mongoose.model("vendors", vendor_schema);
