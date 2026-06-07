const User = require("../models/User");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateToken");

exports.registerUser = async ({ name, email, password, phone }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error("Email already registered");
  const user = await User.create({ name, email, password, phone });
  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshToken = refreshToken;
  await user.save();
  return { user: { _id: user._id, name: user.name, email: user.email, role: user.role }, accessToken, refreshToken };
};

exports.loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password))) throw new Error("Invalid email or password");
  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshToken = refreshToken;
  await user.save();
  return { user: { _id: user._id, name: user.name, email: user.email, role: user.role }, accessToken, refreshToken };
};
