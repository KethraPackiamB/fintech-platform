const Loan = require("../models/Loan");
const { calculateEMI } = require("../utils/calculateEMI");

const DEFAULT_RATE = 12; // 12% p.a.

exports.applyForLoan = async (userId, { amount, tenure, purpose }) => {
  const emi = calculateEMI(amount, DEFAULT_RATE, tenure);
  return Loan.create({ user: userId, amount, tenure, interestRate: DEFAULT_RATE, purpose, emi });
};

exports.getUserLoans = (userId) =>
  Loan.find({ user: userId }).sort("-createdAt");

exports.getLoanById = (loanId, userId) =>
  Loan.findOne({ _id: loanId, user: userId });

exports.getAllLoans = (filters = {}) =>
  Loan.find(filters).populate("user", "name email").sort("-createdAt");

exports.updateLoanStatus = (loanId, status, remarks) =>
  Loan.findByIdAndUpdate(loanId, { status, remarks, ...(status === "disbursed" ? { disbursedAt: new Date() } : {}) }, { new: true });
