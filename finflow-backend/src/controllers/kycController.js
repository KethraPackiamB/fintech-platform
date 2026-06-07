const kycService = require("../services/kycService");
const { success } = require("../utils/apiResponse");

exports.submitKYC = async (req, res, next) => {
  try {
    const kyc = await kycService.submitKYC(req.user._id, req.body, req.files);
    success(res, kyc, "KYC submitted", 201);
  } catch (err) { next(err); }
};

exports.getMyKYC = async (req, res, next) => {
  try {
    const kyc = await kycService.getKYC(req.user._id);
    success(res, kyc, "KYC fetched");
  } catch (err) { next(err); }
};

exports.verifyKYC = async (req, res, next) => {
  try {
    const kyc = await kycService.verifyKYC(req.params.userId, req.body.status, req.body.remarks);
    success(res, kyc, "KYC updated");
  } catch (err) { next(err); }
};
