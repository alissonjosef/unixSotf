/* require("dotenv").config();
const mongoose = require("mongoose");

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

mongoose
  .connect(
    `mongodb+srv://${dbUser}:${dbPassword}@unixjwt.8olc586.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(8080, () => {
      console.log("Conectou ao Banco 👍");
    })
  })
  .catch((err) => console.log(err));

  mongoose.Promise = global.Promise

  module.exports = mongoose */