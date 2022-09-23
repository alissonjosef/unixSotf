const mongoose = require("mongoose");
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
    unique: true,
    required: [true, "{PATH} do usuario é um campo obrigatório"],
  },
  locale: {
    type: String,
    required: [true, "{PATH} do usuario é um campo obrigatório"],
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
    required: [true, "{PATH} do usuario é um campo obrigatório"]
  },
  createAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = Headset;
