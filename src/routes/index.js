const express = require('express');

const router = express.Router();

const authRoutes = require("./authRoutes");
const adminRoutes = require("./adminRoutes");

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);


module.exports = router