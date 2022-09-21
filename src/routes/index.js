const express = require('express');

const router = express.Router();

const authRoutes = require("./authRoutes");
const adminRoutes = require("./adminRoutes");
const companyRoutes = require("./companyRoutes");

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/company", companyRoutes);


module.exports = router