const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    item_id: {
        type: String,
        default: "",
    },
    itemname: {
        type: String,
        required: true
    },
    vendoremail: {
        type: String,
        required: true
    },
    shopname: {
        type: String,
        required: true
    },
    buyeremail: {
        type: String,
        required: true,
    },
    buyername: {
        type: String,
        required: true,
    },
    placedtime: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: "PLACED"
    },
    rating: {
        type: Number,
        default: 0
    },
    addonname: [{
        type: String,
        default: []
    }],
    addonprice: [{
        type: Number,
        default: []
    }],
    totalprice: {
        type: Number,
        required: true,
    },

});

module.exports = Orders = mongoose.model("Orders", OrderSchema);
