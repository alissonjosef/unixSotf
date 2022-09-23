const router = require("express").Router();

const Headset = require("../../models/Headset");
const User = require("../../models/User");

router.use((req, res, next) => {
  //console.log("Called: ", req.auth.profile);
  if (req.auth.profile != "SUPERVISOR") {
    return res.status(401).json({ msg: "Não autorizado" });
  }
  next();
});

router.get("/headset/update", async (req, res) => {
  return res.status(200).json({ msg: "atualizado com sucesso" });
});

router.patch("/headset", async (req, res) => {
 
});

router.post("/activity", async (req, res) => {
 
});

async function tryError(error, res) {
  if (error.name === "ValidationError") {
    let errors = {};

    Object.keys(error.errors).forEach((key) => {
      errors[key] = error.errors[key].message;
    });

    return res.status(400).send(errors);
  }
  console.log(error);
  res.status(500).json({ msg: "Erro interno no servidor" });
}

module.exports = router;
