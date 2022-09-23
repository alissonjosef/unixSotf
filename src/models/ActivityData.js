const mongoose = require("mongoose");
const { Schema } = mongoose;

const ActivityData = mongoose.model("ActivityData", {
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "{PATH} do usuario é um campo obrigatório"],
  },
  status: {
    type: Number,
    required: [true, "{PATH} do usuario é um campo obrigatório"],
    status: Number,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = ActivityData;
