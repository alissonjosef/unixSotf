const router = require("express").Router();

const { userRegister, login, changePassword } = require("../controllers/AuthController");

router.post("/register", async (req, res) => {
  try {
     await userRegister(req.body, "ADMIN", res);
  } catch (error) {
    res.status(400).json({ msg : error.errors})
  }
});


router.post("/", async (req, res) => {
  await login (req.body, res);
});

router.put("/changePassword", async (req, res) => {
  await changePassword (req, res);
});

module.exports = router;
