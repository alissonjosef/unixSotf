require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

const router = require("./src/routes/index")

app.use("/", router)


app.get("/", async (req, res) => {
  res.status(200).json({ msg: "Bem vindo a API ✌️" });
});

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