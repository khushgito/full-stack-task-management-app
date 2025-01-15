const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    items: [
        {
            menuId: {
                type: Schema.Types.ObjectId,
                ref: "Menu",
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true,
    },
});

module.exports = mongoose.model("Order", orderSchema);
