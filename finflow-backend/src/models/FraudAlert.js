const mongoose = require("mongoose");

const fraudAlertSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type:        { type: String, enum: ["suspicious_login","unusual_transaction","multiple_attempts","other"] },
  severity:    { type: String, enum: ["low","medium","high","critical"], default: "low" },
  description: { type: String },
  ipAddress:   { type: String },
  status:      { type: String, enum: ["open","investigating","resolved","false_positive"], default: "open" },
  resolvedAt:  { type: Date },
}, { timestamps: true });
module.exports = mongoose.model("FraudAlert", fraudAlertSchema);
