const mongoose = require("mongoose");
const { Schema } = mongoose;

const Headset = mongoose.model("Headset", {
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User_id",
    required: [true, "{PATH} do usuario é um campo obrigatório"],
  },
  status: {
    type: Number,
    required: [true, "{PATH} do usuario é um campo obrigatório"],
    enum: ["0", "1"],
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Headset;
