const Loan = require("../models/Loan");
const Payment = require("../models/Payment");
const User = require("../models/User");

exports.getDashboardStats = async () => {
  const [totalUsers, totalLoans, disbursedLoans, payments] = await Promise.all([
    User.countDocuments(),
    Loan.countDocuments(),
    Loan.find({ status: "disbursed" }),
    Payment.find({ status: "success" }),
  ]);
  const totalDisbursed = disbursedLoans.reduce((s, l) => s + l.amount, 0);
  const totalCollected = payments.reduce((s, p) => s + p.amount, 0);
  return { totalUsers, totalLoans, totalDisbursed, totalCollected };
};

exports.getLoanAnalytics = () =>
  Loan.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 }, totalAmount: { $sum: "$amount" } } },
  ]);
