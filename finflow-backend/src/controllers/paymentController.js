const paymentService = require("../services/paymentService");
const { success } = require("../utils/apiResponse");

exports.makePayment = async (req, res, next) => {
  try {
    const payment = await paymentService.createPayment(req.user._id, req.body);
    success(res, payment, "Payment processed", 201);
  } catch (err) { next(err); }
};

exports.getMyPayments = async (req, res, next) => {
  try {
    const payments = await paymentService.getUserPayments(req.user._id);
    success(res, payments, "Payments fetched");
  } catch (err) { next(err); }
};

exports.getAllPayments = async (req, res, next) => {
  try {
    const payments = await paymentService.getAllPayments();
    success(res, payments, "All payments fetched");
  } catch (err) { next(err); }
};
