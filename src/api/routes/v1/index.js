const express = require("express");
const userRoutes = require("./user.route");
const authRoutes = require("./auth.route");
const conversation = require("./conversation.route");
const messages = require("./message.route");
const router = express.Router();

/**
 * GET v1/status
 */
router.get("/status", (req, res) => res.send("OK"));

/**
 * GET v1/docs
 */
router.use("/conversation", conversation);
router.use("/messages", messages);
router.use("/users", userRoutes);
router.use("/auth", authRoutes);
module.exports = router;
