const User = require("../../models/User");
const bcrypt = require("bcrypt");
const {getToken} = require("../../config/jwt-config");

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

const login = async (userCreds, res) => {
  const { registry, password } = userCreds;

  const user = await User.findOne({ registry: registry });

  if(!user){
    return res.status(401).json({ msg: "Usuario inexistente" });
  }

  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    return res.status(422).json({ msg: "Senha invalida!" });
  }

  try {
  
    const obj = {
      id: user.id,
      email: user.email,
      cpf: user.cpf,
      profile: user.profile,
    };
  
    const token = getToken(obj);

    const result = {
      name: user.name,
      profile: user.profile,
      token,
      id: user._id,
      enabled: user.enabled
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
  login
};
