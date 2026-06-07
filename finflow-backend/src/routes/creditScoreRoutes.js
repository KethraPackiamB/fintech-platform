const router = require("express").Router();
const { getMyCreditScore } = require("../controllers/creditScoreController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/", protect, getMyCreditScore);

module.exports = router;
