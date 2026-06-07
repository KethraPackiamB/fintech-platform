const analyticsService = require("../services/analyticsService");
const { success } = require("../utils/apiResponse");

exports.getDashboardStats = async (req, res, next) => {
  try {
    const stats = await analyticsService.getDashboardStats();
    success(res, stats, "Dashboard stats fetched");
  } catch (err) { next(err); }
};

exports.getLoanAnalytics = async (req, res, next) => {
  try {
    const data = await analyticsService.getLoanAnalytics();
    success(res, data, "Loan analytics fetched");
  } catch (err) { next(err); }
};
