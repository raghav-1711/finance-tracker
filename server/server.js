require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const transactionRoutes = require("./routes/transactionRoutes");

const authRoutes = require("./routes/authRoutes");

const app = express();   // ✅ FIRST create app

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/api/transactions", transactionRoutes);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/auth", authRoutes);
// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});