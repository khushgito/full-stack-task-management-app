const express = require("express");
const router = express.Router();
const Menu = require("../../model/Menu");

router.get("/", async (req, res) => {
    const { page = 1, limit = 50 } = req.query;
    try {
        const menuItems = await Menu.find()
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
        const count = await Menu.countDocuments();
        res.status(200).json({
            menuItems,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/", async (req, res) => {
    const { name, category, price, availability } = req.body;

    if (
        !name ||
        !category ||
        (availability !== undefined && typeof availability !== "boolean")
    ) {
        return res.status(400).json({ message: "Invalid data" });
    }

    if (availability === undefined) {
        availability = true;
    }

    const menuItem = new Menu({
        name,
        category,
        price,
        availability,
    });

    try {
        const newMenuItem = await menuItem.save();
        res.status(201).json(newMenuItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put("/:id", async (req, res) => {
    const { name, category, price, availability } = req.body;

    if (
        (name && typeof name !== "string") ||
        (category && typeof category !== "string") ||
        (price && typeof price !== "number") ||
        (availability && typeof availability !== "boolean")
    ) {
        return res.status(400).json({ message: "Invalid data" });
    }

    try {
        const updatedMenuItem = await Menu.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedMenuItem) {
            return res.status(404).json({ message: "Menu item not found" });
        }
        res.status(200).json(updatedMenuItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const deletedMenuItem = await Menu.findByIdAndDelete(req.params.id);
        if (!deletedMenuItem) {
            return res.status(404).json({ message: "Menu item not found" });
        }
        res.status(200).json({ message: "Menu item deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
