const User = require("../../models/User");
const bcrypt = require("bcrypt");

const userRegister = async (userDets, role, res) => {
  try {
    let usernameNotTaken = await validateUsername(userDets.username);
  if (!usernameNotTaken) {
    return res.status(400).json({
      message: `Username is already taken.`,
      success: false,
    });
  }

  let emailNotRegistre = await validateEmail(userDets.email);
  if (!emailNotRegistre) {
    return res.status(400).json({
      message: `Email is already registered.`,
      success: false,
    });
  }

  const password = await bcrypt.hashed(userDets.password, 12);

  const newUser = new User({
    ...userDets,
    password,
    role
  });
  await newUser.save();
  return res.status(201).json({
    message: `Hurry! now you are successfully registred. Please nor login.`,
    success: true,
  });
  } catch (error) {
    return res.status(500).json({
        message: `Unableto create your accnot`,
        success: false,
      });
  }
};

const validateUsername = async (username) => {
  let user = await User.findOne({ username });
  return user ? false : true;
};

const validateEmail = async (email) => {
  let user = await User.findOne({ email });
  return user ? false : true;
};

module.exports = {
    userRegister
}