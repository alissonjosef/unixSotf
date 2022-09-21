const mongoose = require("mongoose");
const validators = require("mongoose-validators");

const {Schema} = mongoose

const Headset = mongoose.model("Headset", {
  model: {
    type: String,
    trim: true,
    required: [true, "{PATH} do usuario é um campo obrigatório"],
  },
  serial_number: {
    type: String,
    trim: true,
    unique: false,
    required: [true, "{PATH} do usuario é um campo obrigatório"],
  },
  locale: {
    type: String,
    unique: true,
    required: [true, "{PATH} do usuario é um campo obrigatório"],
    validate: validators.isEmail({ message: "{VALUE} não é um {PATH} válido" }),
  },
  status: {
    type: String,
    required: [true, "{PATH} do usuario é um campo obrigatório"],
    enum: ["DISPONIVEL", "EM_USO", "INOPERANTE"],
    default: 'DISPONIVEL'
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: "Company",
  },
  createAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = Headset;
