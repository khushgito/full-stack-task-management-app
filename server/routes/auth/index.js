const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../model/User");

router.post("/register", async (req, res) => {
    const { username, password } = req.body;

    if (
        !username ||
        typeof username !== "string" ||
        !password ||
        password.length < 6
    ) {
        return res.status(400).json({ message: "Invalid data" });
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error registering user" });
    }
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (
        !username ||
        typeof username !== "string" ||
        !password ||
        typeof password !== "string"
    ) {
        return res.status(400).json({ message: "Invalid data" });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res
                .status(400)
                .json({ error: "Invalid username or password" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res
                .status(400)
                .json({ error: "Invalid username or password" });
        }
        const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, {
            expiresIn: "1h",
        });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: "Error logging in user" });
    }
});

module.exports = router;
