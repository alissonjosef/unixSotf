const router = require("express").Router();

const Headset = require("../models/Headset");
const User = require("../models/User");

const multer = require("multer");
const { Readable } = require("stream");
const readline = require("readline");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const multerConfig = multer();

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

router.post(
  "/headset/upload",
  multerConfig.single("file"),
  async (req, res) => {
    const { file } = req;
    const { buffer } = file;

    const readableFile = new Readable();
    readableFile.push(buffer);
    readableFile.push(null);

    const headsetLine = readline.createInterface({
      input: readableFile,
    });

    const headsetCsv = [];

    for await (let line of headsetLine) {
      const headsetLineSplit = line.split(";");

      headsetCsv.push({
        model: headsetLineSplit[0],
        serial_number: headsetLineSplit[1],
        locale: headsetLineSplit[2],
      });
    }

    try {
      for await (let { model, serial_number, locale } of headsetCsv) {
        const headsetWithModel = await Headset.findOne({ model });
        if (headsetWithModel) {
          return res.status(400).json({ msg: "Modelo já cadastrado" });
        }

        const headsetWithSerial = await Headset.findOne({ serial_number });
        if (headsetWithSerial) {
          return res
            .status(400)
            .json({ msg: "Numero de serial já cadastrado" });
        }
        await Headset({
          model,
          serial_number,
          locale,
          company: req.auth.company,
        }).save();
      }
      res.status(200).json({ msg: "Atualizado com sucesso" });
    } catch (error) {
      await tryError(error, res);
    }
  }
);

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
    const passwordUnique = "@unix";
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(passwordUnique, salt);

    const user = new User({
      name,
      cpf,
      registry,
      email,
      phone,
      headset,
      password: passwordHash,
      profile,
      company: req.auth.company,
    });

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    await tryError(error, res);
  }
});

router.put("/user", async (req, res) => {
  const { name, cpf, registry, email, phone, enabled, profile, _id, password } =
    req.body;

  try {
    const passwordUnique = "@unix";
    let user = await User.findByIdAndUpdate(_id, {
      name,
      cpf,
      email,
      phone,
      password: passwordUnique,
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
  const { name, registry, limit, skip } = req.query;

  const company = req.auth.company;

  if (name && !name.trim() !== "") {
    return res.status(200).json(
      await User.find({
        name,
        company,
      })
        .skip(Number(skip))
        .limit(Number(limit))
    );
  }

  if (registry && !registry.trim() !== "") {
    return res.status(200).json(
      await User.find({
        registry,
        company,
      })
        .skip(Number(skip))
        .limit(Number(limit))
    );
  }

  return res.status(200).json(
    await User.find({
      company,
    })
      .skip(Number(skip))
      .limit(Number(limit))
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
