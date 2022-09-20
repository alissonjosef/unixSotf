const router = require("express").Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../../models/User");

const { userRegister, login } = require("../controllers/AuthController");

router.post("/admin", async (req, res) => {
  await userRegister(req.body, "ADMIN", res);
});


router.post("/", async (req, res) => {
  await login (req.body, res);
});

module.exports = router;
