const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { setBudget } = require("../controllers/budgetController");

router.post("/", auth, setBudget);

module.exports = router;