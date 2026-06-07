const router = require("express").Router();

router.use("/auth",        require("./authRoutes"));
router.use("/loans",       require("./loanRoutes"));
router.use("/payments",    require("./paymentRoutes"));
router.use("/kyc",         require("./kycRoutes"));
router.use("/credit-score",require("./creditScoreRoutes"));
router.use("/analytics",   require("./analyticsRoutes"));
router.use("/fraud",       require("./fraudRoutes"));
router.use("/admin",       require("./adminRoutes"));

module.exports = router;
