const { body } = require("express-validator");

exports.submitKycValidator = [
  body("aadhaar").matches(/^\d{12}$/).withMessage("Aadhaar must be 12 digits"),
  body("pan").matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/).withMessage("Invalid PAN format"),
  body("dob").isDate().withMessage("Valid date of birth required"),
  body("address").notEmpty().withMessage("Address is required"),
];
