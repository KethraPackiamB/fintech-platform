const logger = require("../utils/logger");

exports.notFound = (req, res, next) => {
  const err = new Error(`Not found - ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
};

exports.errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  logger.error(err.message, { stack: err.stack });

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: "Validation error", errors });
  }
  if (err.code === 11000) {
    return res.status(400).json({ success: false, message: "Duplicate field value", errors: [err.message] });
  }
  res.status(statusCode).json({ success: false, message: err.message || "Server error" });
};
