const router = require("express").Router();

const Headset = require("../models/Headset");
const User = require("../models/User");

router.use((req, res, next) => {
  //console.log("Called: ", req.auth.profile);
  if (req.auth.profile != "OPERADOR") {
    return res.status(401).json({ msg: "Não autorizado" });
  }
  next();
});

router.get("/headset/update", async (req, res) => {
  return res.status(200).json({ msg: "atualizado com sucesso" });
});

router.patch("/headset", async (req, res) => {
  const { model, serial_number, locale } = req.body;

  if (!model | !serial_number | !locale) {
    return res.status(400).json({ msg: "Campo invalido" });
  }
  try {
    const headset = new Headset({
      model,
      serial_number,
      locale,
      company: req.auth.company,
    });

    await headset.save();
    res.status(200).json(headset);
  } catch (error) {
    await tryError(error, res);
  }
 
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
