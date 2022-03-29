const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FoodListSchema = new Schema({
    manageremail: { 
        type: String, 
        required: true 
    },
    itemname: {
        type: String,
        required: true
    },
    shopname: {
        type: String,
        default: "Shop Name"
    },
    image: {
        type: String,
        default: "https://image.similarpng.com/very-thumbnail/2021/09/Good-food-logo-design-on-transparent-background-PNG.png"
    },
    price: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        default: 0
    },
    ratingcount: {
        type: Number,
        default: 0
    },
    veg: {
        type: Boolean,  // true for veg and false for non-veg
        required: true
    },
    //Completed Orders
    sold: {
        type: Number,
        required: true,
        default: 0
    },
    tags: [{
        type: String,
        default: []
    }],
    addonname: [{
        type: String,
        default: []
    }],
    addonprice: [{
        type: Number,
        default: []
    }],
});

module.exports = FoodList = mongoose.model("FoodList", FoodListSchema);
