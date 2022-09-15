const mongoose = require("mongoose");
const validators = require("mongoose-validators");

const User = mongoose.model("User", {
  name: {
    type: String,
    trim: true,
    required: [true, "{PATH} do usuario é um campo obrigatório"],
  },
  cpf: {
    type: String,
    trim: true,
    unique: false,
    required: [true, "{PATH} do usuario é um campo obrigatório"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "{PATH} do usuario é um campo obrigatório"],
    validate: validators.isEmail({ message: "{VALUE} não é um {PATH} válido" }),
  },
  password: {
    type: String,
    required: [true, "{PATH} do usuario é um campo obrigatório"],
  },
  profile: {
    type: String,
    required: [true, "{PATH} do usuario é um campo obrigatório"],
    enum: ["OPERADOR", "ADMIN", "SUPERVISOR"],
  },
  registry: {
    type: String,
    unique: true,
    required: [true, "{PATH} do usuario é um campo obrigatório"],
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = User;
