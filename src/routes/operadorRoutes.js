const router = require("express").Router();

const Headset = require("../models/Headset");
const ActivityData = require("../models/ActivityData");
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
  const { model, serial_number } = req.body;

  if (!model | !serial_number) {
    return res.status(400).json({ msg: "Campo invalido" });
  }
  try {
    let usuario = await User.findById(req.auth.id);
    console.log(req.auth);
    let headset = await Headset.findOne({
      serial_number,
    });

    if (!headset) {
      headset = new Headset({
        model,
        serial_number,
        company: req.auth.company,
      });

      await headset.save();
    }
    usuario.headset = headset._id;

    await usuario.save();

    res.status(200).json({ msg: "Headset atualizado" });
  } catch (error) {
    await tryError(error, res);
  }
});

router.post("/activity", async (req, res) => {
  const {status}  = req.body;

  try {
    const headset = new ActivityData({
      status,
      company: req.auth.company,
      user: req.auth.id,
    });

    await headset.save();
    res.status(200).json(headset);
  } catch (error) {
    await tryError(error, res);
  }
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
