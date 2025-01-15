const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const menuSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    availability: {
        type: Boolean,
        default: true,
        required: true,
    },
});

module.exports = mongoose.model("Menu", menuSchema);
