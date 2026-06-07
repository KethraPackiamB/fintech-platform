const router = require("express").Router();
const { applyLoan, getMyLoans, getLoanById } = require("../controllers/loanController");
const { protect } = require("../middlewares/authMiddleware");
const { applyLoanValidator } = require("../validators/loanValidators");
const validate = require("../middlewares/validateRequest");

router.post("/",    protect, applyLoanValidator, validate, applyLoan);
router.get("/",     protect, getMyLoans);
router.get("/:id",  protect, getLoanById);

module.exports = router;
