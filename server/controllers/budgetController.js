const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");

exports.setBudget = async (req, res) => {
  const { month, year, limit } = req.body;

  const budget = await Budget.findOneAndUpdate(
    { userId: req.user.id, month, year },
    { limit },
    { upsert: true, new: true }
  );

  res.json(budget);
};