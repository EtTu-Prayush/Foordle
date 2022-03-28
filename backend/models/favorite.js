const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fav_schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    vendor_email: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    vendor_shop: {
        type: String,
        required: true,
    },
});

module.exports = favorite = mongoose.model("fav", fav_schema);
