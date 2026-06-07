const router = require("express").Router();
const { getDashboardStats, getLoanAnalytics } = require("../controllers/analyticsController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

router.get("/dashboard", protect, getDashboardStats);
router.get("/loans",     protect, adminOnly, getLoanAnalytics);

module.exports = router;
