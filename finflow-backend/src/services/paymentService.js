const Payment = require("../models/Payment");
const { v4: uuidv4 } = require("uuid");

exports.createPayment = async (userId, data) => {
  const transactionId = uuidv4();
  return Payment.create({ user: userId, transactionId, ...data, status: "success", paidAt: new Date() });
};

exports.getUserPayments = (userId) =>
  Payment.find({ user: userId }).sort("-createdAt");

exports.getAllPayments = () =>
  Payment.find().populate("user", "name email").sort("-createdAt");
