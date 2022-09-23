const router = require("express").Router();

const Headset = require("../models/Headset");
const User = require("../models/User");

router.use((req, res, next) => {
  //console.log("Called: ", req.auth.profile);
  if (req.auth.profile != "SUPERVISOR") {
    return res.status(401).json({ msg: "Não autorizado" });
  }
  next();
});

router.get("/relatorio/:id", async (req, res) => {
  return res.status(200).json({ msg: `Relatório da data ${req.query.data}` });
});

router.post("/headset", async (req, res) => {
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

router.get("/headset", async (req, res) => {
  const { limit, skip } = req.query;

  return res.status(200).json(
    await Headset.find({
      company: req.auth.company,
    })
      .skip(Number(skip))
      .limit(Number(limit))
  );
});

router.put("/headset", async (req, res) => {
  const { _id, model, serial_number, locale, status } = req.body;

  try {
    let headset = await Headset.findByIdAndUpdate(_id, {
      model,
      serial_number,
      locale,
      status,
    });
    if (!headset) {
      return res.status(404).json({ msg: "Não encontrado" });
    }

    res.status(200).json({ msg: "Atualizado com sucesso" });
  } catch (error) {
    await tryError(error, res);
  }
});

router.post("/user", async (req, res) => {
  const { name, cpf, registry, email, phone, headset, profile } = req.body;

  if (!name | !cpf | !registry | !email | !phone) {
    return res.status(400).json({ msg: "Campo invalido" });
  }

  if (!profile || ("OPERADOR" != profile && "SUPERVISOR" != profile)) {
    return res.status(400).json({ msg: "Perfil invalido" });
  }

  const userWithRegistry = await User.findOne({ registry });
  if (userWithRegistry) {
    return res.status(400).json({ msg: "Registro já cadastrado" });
  }

  const userWithCpf = await User.findOne({ cpf });
  if (userWithCpf) {
    return res.status(400).json({ msg: "CPF já cadastrado" });
  }

  const userWithEmail = await User.findOne({ email });
  if (userWithEmail) {
    return res.status(400).json({ msg: "E-mail já cadastrado" });
  }

  const existHeadset = await Headset.findOne({ headset });
  if (!existHeadset) {
    return res.status(400).json({ msg: "Headset não cadastrado" });
  }

  try {
    const password = "@unix";
    const user = new User({
      name,
      cpf,
      registry,
      email,
      phone,
      headset,
      password,
      profile,
    });

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    await tryError(error, res);
  }
});

router.put("/user", async (req, res) => {
  const { name, cpf, registry, email, phone, enabled, profile, _id } = req.body;

  try {
    const password = "@unix";
    let user = await User.findByIdAndUpdate(_id, {
      name,
      cpf,
      email,
      phone,
      password,
      profile,
      registry,
      enabled,
    });
    if (!user) {
      return res.status(404).json({ msg: "Não encontrado" });
    }

    res.status(200).json({ msg: "Atualizado com sucesso" });
  } catch (error) {
    await tryError(error, res);
  }
});

router.get("/user", async (req, res) => {
  const {name, registry} = req.query

  return res.status(200).json(
    await User.find({
      name
    })
  );
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
