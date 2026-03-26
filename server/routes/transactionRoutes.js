const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const authMiddleware = require("../middleware/authMiddleware");

// Add Transaction
router.post("/", authMiddleware, async (req, res) => {
  console.log("BODY:", req.body);
  console.log("USER:", req.user);
  try {
    const { title, amount, type } = req.body;

    const transaction = await Transaction.create({
      user: req.user.id,
      title,
      amount,
      type,
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Delete transaction
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Make sure transaction belongs to logged-in user
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await transaction.deleteOne();

    res.json({ message: "Transaction deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get All Transactions
router.get("/", authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;