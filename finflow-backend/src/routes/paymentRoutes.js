const router = require("express").Router();
const { makePayment, getMyPayments } = require("../controllers/paymentController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/", protect, makePayment);
router.get("/",  protect, getMyPayments);

module.exports = router;
