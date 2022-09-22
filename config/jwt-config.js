const jwtConfig = require("jsonwebtoken");
var { expressjwt: jwt } = require("express-jwt");
require("dotenv/config");

const { JWT_SECRET, JWT_EXPIRATION_TIME } = process.env;


const getToken = (user) => {
  const payload = {
    ...user,
  };
  const expires =
    user.profile !== "OPERADOR" ? JWT_EXPIRATION_TIME : '999d';
    console.log(payload, expires)
  const token = jwtConfig.sign(payload, JWT_SECRET, {
    expiresIn: expires,
  });

  return token;
};

const getFromToken = async (token) => {
  return jwtConfig.decode(token);
};

const configuration = jwt({
  secret: JWT_SECRET,
  algorithms: ["HS256"],
});

module.exports = { getToken, getFromToken, configuration };
