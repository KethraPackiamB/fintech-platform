const mongoose = require("mongoose");

const kycSchema = new mongoose.Schema({
  user:       { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  aadhaar:    { type: String },
  pan:        { type: String },
  dob:        { type: Date },
  address:    { type: String },
  documents:  [{ docType: String, url: String, uploadedAt: Date }],
  status:     { type: String, enum: ["not_submitted","pending","verified","rejected"], default: "not_submitted" },
  verifiedAt: { type: Date },
  remarks:    { type: String },
}, { timestamps: true });
module.exports = mongoose.model("KYC", kycSchema);
