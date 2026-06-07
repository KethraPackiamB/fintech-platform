const router = require("express").Router();
const { getAllLoans, updateLoanStatus } = require("../controllers/loanController");
const { getAllPayments } = require("../controllers/paymentController");
const { verifyKYC } = require("../controllers/kycController");
const { getAllUsers } = require("../controllers/authController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

router.get("/loans",                 protect, adminOnly, getAllLoans);
router.patch("/loans/:id/status",    protect, adminOnly, updateLoanStatus);
router.get("/payments",              protect, adminOnly, getAllPayments);
router.patch("/kyc/:userId/verify",  protect, adminOnly, verifyKYC);
router.get("/users",                 protect, adminOnly, getAllUsers);

module.exports = router;
