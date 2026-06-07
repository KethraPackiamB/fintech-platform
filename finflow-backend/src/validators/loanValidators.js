const { body } = require("express-validator");

exports.applyLoanValidator = [
  body("amount").isNumeric().withMessage("Amount must be numeric").isFloat({ min: 1000 }).withMessage("Minimum amount is 1000"),
  body("tenure").isInt({ min: 1, max: 360 }).withMessage("Tenure must be 1-360 months"),
  body("purpose").notEmpty().withMessage("Purpose is required"),
];
