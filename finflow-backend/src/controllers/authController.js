const { registerUser, loginUser } = require("../services/authService");
const { success, error } = require("../utils/apiResponse");
const User = require("../models/User");

exports.register = async (req, res, next) => {
  try {
    const data = await registerUser(req.body);
    success(res, data, "Registered successfully", 201);
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const data = await loginUser(req.body);
    success(res, data, "Login successful");
  } catch (err) { err.statusCode = 401; next(err); }
};

exports.getMe = (req, res) => success(res, req.user, "User fetched");

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort("-createdAt");
    success(res, users, "All users fetched");
  } catch (err) { next(err); }
};

exports.logout = async (req, res, next) => {
  try {
    req.user.refreshToken = undefined;
    await req.user.save();
    success(res, null, "Logged out");
  } catch (err) { next(err); }
};
