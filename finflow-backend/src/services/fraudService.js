const FraudAlert = require("../models/FraudAlert");

exports.getAllAlerts = () =>
  FraudAlert.find().populate("user", "name email").sort("-createdAt");

exports.createAlert = (data) => FraudAlert.create(data);

exports.resolveAlert = (alertId, status) =>
  FraudAlert.findByIdAndUpdate(
    alertId,
    { status, ...(status === "resolved" ? { resolvedAt: new Date() } : {}) },
    { new: true }
  );
