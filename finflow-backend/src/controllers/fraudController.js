const fraudService = require("../services/fraudService");
const { success } = require("../utils/apiResponse");

exports.getAlerts = async (req, res, next) => {
  try {
    const alerts = await fraudService.getAllAlerts();
    success(res, alerts, "Fraud alerts fetched");
  } catch (err) { next(err); }
};

exports.resolveAlert = async (req, res, next) => {
  try {
    const alert = await fraudService.resolveAlert(req.params.id, req.body.status);
    success(res, alert, "Alert updated");
  } catch (err) { next(err); }
};
