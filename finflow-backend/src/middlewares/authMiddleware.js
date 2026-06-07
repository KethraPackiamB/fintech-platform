const jwt = require("jsonwebtoken");
const { secret } = require("../config/jwtConfig");
const User = require("../models/User");
const { error } = require("../utils/apiResponse");

exports.protect = async (req, res, next) => {
  const token = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1] : null;
  if (!token) return error(res, "Not authorized, no token", 401);
  try {
    const decoded = jwt.verify(token, secret);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) return error(res, "User not found", 401);
    next();
  } catch {
    error(res, "Token invalid or expired", 401);
  }
};

exports.adminOnly = (req, res, next) => {
  const adminRoles = ["admin", "super_admin", "loan_officer", "risk_analyst"];
  if (!adminRoles.includes(req.user?.role)) return error(res, "Admin access required", 403);
  next();
};
