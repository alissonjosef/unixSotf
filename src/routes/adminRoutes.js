const router = require("express").Router();
const { userRegister } = require("../controllers/userController");
const Company = require("../models/Company");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

router.use((req, res, next) => {
  //console.log("Called: ", req.auth.profile);
  if (req.auth.profile != "ADMIN") {
    return res.status(401).json({ msg: "Não autorizado" });
  }
  next();
});

router.post("/company", async (req, res) => {
  const { email, name, cnpj, phone } = req.body;

  try {
    if (!email | !name | !cnpj | !phone) {
      return res.status(400).json({ msg: "Campo invalido" });
    }

    const companyWithCnpj = await Company.findOne({ cnpj });
    if (companyWithCnpj) {
      return res.status(400).json({ msg: "CNPJ já cadastrado" });
    }

    const companyWithEmail = await Company.findOne({ email });
    if (companyWithEmail) {
      return res.status(400).json({ msg: "E-mail já cadastrado" });
    }

    /* const passwordUnique = "@unix"; */

    const transporter = nodemailer.createTransport({
      name: process.env.MAILER_PASS,
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const passwordUnique = crypto.randomBytes(4).toString("HEX");

    transporter
      .sendMail({
        from: "Administrador <3f45fcae-df63-360c-ab44-ffc93ec56fc4@gmail.com>",
        to: email,
        subject: "Recuperação de senha!",
        html: `<p>Olá, sua nova senha para acessar o sistema e: ${passwordUnique}</p>`,
      })
      .then((msg) => {
        console.log({ msg });
      })
      .catch((err) => {
        console.log(err);
      });

    const user = await userRegister(
      {
        name: name,
        cpf: cnpj,
        email: email,
        registry: cnpj,
        phone: phone,
        password: passwordUnique,
      },
      "SUPERVISOR",
      res
    );

    const company = new Company({
      name,
      cnpj,
      email,
      phone,
      master: user._id,
    });

    await company.save();

    console.log(company);
    user.company = company._id;

    await user.save();

    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ msg: "Erro interno" });
  }
});

router.put("/company/:id", async (req, res) => {
  const id = req.params.id;

  const { email, name, cnpj, phone, enabled } = req.body;

  const company = {
    email,
    name,
    cnpj,
    phone,
    enabled,
  };

  const updatedCompany = await Company.updateOne({ _id: id }, company);

  return res.status(200).json({ msg: "Registro Atualizado" });
});

router.get("/company", async (req, res) => {
  try {
    const company = await Company.find();

    res.status(200).json(company);
  } catch (error) {
    res.status(200).json({ error: error });
  }
});

module.exports = router;
