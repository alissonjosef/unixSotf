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


/* router.get("/:id", checkToken, async (req, res) => {
  const id = req.params.id;

  const user = await User.findById(id, "-password");

  if (!user) {
    return res.status(404).json({ msg: "Usuario não encontrado" });
  }

  res.status(200).json({ user });
});

function checkToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Acesso negado!" });
  }

  try {
    const secret = process.env.SECRET;

    jwt.verify(token, secret);

    next();
  } catch (error) {
    res.status(400).json({ msg: "Token inválido" });
  }
}

router.post("/", async (req, res) => {
  const {
    name,
    cpf,
    email,
    profile,
    registry,
    password,
    confirmpassword,
    createAt,
  } = req.body;

  if (!registry) {
    return res.status(422).json({ msg: "O nome e obrigatorio!" });
  }

  if (!password) {
    return res.status(422).json({ msg: "A senha e obrigatorio!" });
  }

  if (password !== confirmpassword) {
    return res.status(422).json({ msg: "As senha não conferem!" });
  }

  const userExists = await User.findOne({ registry: registry });

  if (userExists) {
    return res.status(422).json({ msg: "Por favor, utlize outro registro!" });
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = new User({
    name,
    cpf,
    email,
    profile,
    registry,
    password: passwordHash,
    createAt,
  });

  try {
    await user.save();

    res.status(201).json({ meg: "Usuario criado como sucesso" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "error no servidor" });
  }
});

router.post("/login", async (req, res) => {
  const { registry, password } = req.body;

  if (!registry) {
    return res.status(422).json({ msg: "O nome e obrigatorio!" });
  }

  if (!password) {
    return res.status(422).json({ msg: "A senha e obrigatorio!" });
  }

  const user = await User.findOne({ registry: registry });

  if (!user) {
    return res.status(402).json({ msg: "Usuario não encontrado!" });
  }

  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    return res.status(422).json({ msg: "Senha invalida!" });
  }

  try {
    const secret = process.env.SECRET;

    const token = jwt.sign(
      {
        id: user._id,
      },
      secret
    );

    res.status(200).json({ msg: "Autenticação realizada com sucesso", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "error no servidor" });
  }
}); */

module.exports = router;
