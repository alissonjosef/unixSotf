const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRegister = async (userDets, profile, res) => {
  let usernameNotTaken = await userExists(userDets.registry);
  if (!usernameNotTaken) {
    return res.status(422).json({
      message: `Por favor, utlize outro registro!`,
      success: false,
    });
  }

  let passwordNotTaken = await passwordExists(userDets.password);
  if (!passwordNotTaken) {
    return res.status(422).json({
      message: `A senha e obrigatorio!`,
      success: false,
    });
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(userDets.password, salt);

  const user = new User({
    ...userDets,
    password: passwordHash,
    profile,
  });

  try {
    await user.save();

    res.status(201).json({ meg: "Usuario criado como sucesso" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Unable to connect with Database" });
  }
};

const adminLogin = async (userCreds, profile, res) => {
  const { registry, password } = userCreds;

  const user = await User.findOne({ registry: registry });

  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    return res.status(422).json({ msg: "Senha invalida!" });
  }

  if (user.profile === profile) {
    return res
      .status(422)
      .json({
        msg: "Certifique-se de que está a iniciar sessão a partir do portal certo",
      });
  }

  try {
    const secret = process.env.SECRET;

    const token = jwt.sign(
      {
        id: user._id,
        profile: user.profile
      },
      secret,
      { expiresIn: "7 days" }
    );

    const result = {
      token,
      id: user._id,
      expiresIn: 168,
    };

    res
      .status(200)
      .json({ ...result, msg: "Autenticação realizada com sucesso", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "error no servidor" });
  }
};

const userExists = async (registry) => {
  const user = await User.findOne({ registry });
  return user ? false : true;
};

const passwordExists = async (password) => {
  const passwordUser = await User.findOne({ password });
  return passwordUser ? false : true;
};

module.exports = {
  userRegister,
  adminLogin
};
