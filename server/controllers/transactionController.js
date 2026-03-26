const Transaction = require("../models/Transaction");

exports.addTransaction = async (req, res) => {
  const transaction = await Transaction.create({
    ...req.body,
    userId: req.user.id
  });
  res.json(transaction);
};

exports.getTransactions = async (req, res) => {
  const transactions = await Transaction.find({
    userId: req.user.id
  });
  res.json(transactions);
};

exports.deleteTransaction = async (req, res) => {
  await Transaction.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully" });
};