const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    item_name: {
        type: String,
        required: true
    },
    vendor_shop: {
        type: String,
        required: true
    },
    vendor_email: {
        type: String,
        required: true
    }, buyer_email: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    placed_time: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "PLACED"
    },
    rating: {
        type: Number,
        default: 0
    },
    addon_name: {
        type: [String],
        default: []
    },
    rated: {
        type: Number,
        default: 0
    }
    ,
    addon_price: {
        type: [Number],
        default: []
    }
    ,
    bill: {
        type: Number,
        required: true
    }
});

module.exports = Order = mongoose.model("Order", OrderSchema);
