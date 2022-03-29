const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StatsSchema = new Schema({
    manageremail: { type: String, required: true },
    shopname: { type: String, required: true },
    orders_placed: { type: Number, required: true, default: 0 },
    pending_orders: { type: Number, required: true, default: 0 },
    completed_orders: { type: Number, required: true, default: 0 },
});

module.exports = Stats = mongoose.model("Stats", StatsSchema);
