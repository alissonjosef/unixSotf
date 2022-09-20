const User = require("../../models/User");
const bcrypt = require("bcrypt");

const userRegister = async (userDets, profile, res) => {
  let usernameNotTaken = await userExists(userDets.registry);
  if (!usernameNotTaken) {
    return res.status(422).json({
      message: `Por favor, utlize outro registro!`,
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

  return await user.save();
};

const userExists = async (registry) => {
  const user = await User.findOne({ registry });
  return user ? false : true;
};
module.exports = { userRegister };
