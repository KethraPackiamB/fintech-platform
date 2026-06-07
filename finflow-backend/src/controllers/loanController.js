const loanService = require("../services/loanService");
const { success } = require("../utils/apiResponse");

exports.applyLoan = async (req, res, next) => {
  try {
    const loan = await loanService.applyForLoan(req.user._id, req.body);
    success(res, loan, "Loan application submitted", 201);
  } catch (err) { next(err); }
};

exports.getMyLoans = async (req, res, next) => {
  try {
    const loans = await loanService.getUserLoans(req.user._id);
    success(res, loans, "Loans fetched");
  } catch (err) { next(err); }
};

exports.getLoanById = async (req, res, next) => {
  try {
    const loan = await loanService.getLoanById(req.params.id, req.user._id);
    if (!loan) { const err = new Error("Loan not found"); err.statusCode = 404; return next(err); }
    success(res, loan, "Loan fetched");
  } catch (err) { next(err); }
};

exports.getAllLoans = async (req, res, next) => {
  try {
    const loans = await loanService.getAllLoans(req.query);
    success(res, loans, "All loans fetched");
  } catch (err) { next(err); }
};

exports.updateLoanStatus = async (req, res, next) => {
  try {
    const loan = await loanService.updateLoanStatus(req.params.id, req.body.status, req.body.remarks);
    success(res, loan, "Loan status updated");
  } catch (err) { next(err); }
};
