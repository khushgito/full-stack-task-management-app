const express = require("express");
const router = express.Router();
const Order = require("../../model/Order");
const { verifyToken } = require("../../middleware/auth");

router.post("/", verifyToken, async (req, res) => {
    const { items, totalAmount } = req.body;

    if (
        !Array.isArray(items) ||
        items.length === 0 ||
        typeof totalAmount !== "number" ||
        totalAmount <= 0
    ) {
        return res.status(400).json({ message: "Invalid data" });
    }

    try {
        const newOrder = new Order({
            userId: req.user._id,
            items,
            totalAmount,
        });
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/", verifyToken, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/:id/complete", verifyToken, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { status: "completed" },
            { new: true }
        );
        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
