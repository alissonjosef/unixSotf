const mongoose = require("mongoose");
const validators = require("mongoose-validators");

const {Schema} = mongoose

const Company = mongoose.model("Company", {
  name: {
    type: String,
    trim: true,
    required: [true, "{PATH} do usuario é um campo obrigatório"],
  },
  cnpj: {
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
  phone: {
    type: String,
    required: [true, "{PATH} do usuario é um campo obrigatório"],
  },
  master: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Company;
