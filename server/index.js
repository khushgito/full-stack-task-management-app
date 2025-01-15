const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();

app.use(express.json());
dotenv.config();
app.use(cors());

const menuRoutes = require("./routes/menu");
const authRoutes = require("./routes/auth");
const orderRoutes = require("./routes/orders");
const logger = require("./middleware/logger");

app.use(logger);
app.use("/api/menu", menuRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/order", orderRoutes);

app.get("/", (req, res) => {
    res.send("Server health check");
});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
    mongoose
        .connect(process.env.MONGODB_URI)
        .then(() => console.log("Connected to MongoDB"))
        .catch((err) => console.error("MongoDB connection error:", err));
});
