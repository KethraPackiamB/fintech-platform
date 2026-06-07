const creditScoreService = require("../services/creditScoreService");
const { success } = require("../utils/apiResponse");

exports.getMyCreditScore = async (req, res, next) => {
  try {
    const score = await creditScoreService.getCreditScore(req.user._id);
    success(res, score, "Credit score fetched");
  } catch (err) { next(err); }
};
