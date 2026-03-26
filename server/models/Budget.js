const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  month: Number,
  year: Number,
  limit: Number
});

module.exports = mongoose.model("Budget", budgetSchema);