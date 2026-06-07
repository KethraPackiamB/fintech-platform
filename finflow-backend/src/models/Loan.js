const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema({
  user:         { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount:       { type: Number, required: true },
  tenure:       { type: Number, required: true },
  interestRate: { type: Number, required: true },
  purpose:      { type: String, required: true },
  status:       { type: String, enum: ["pending","approved","rejected","disbursed","closed"], default: "pending" },
  emi:          { type: Number },
  disbursedAt:  { type: Date },
  documents:    [{ name: String, url: String, uploadedAt: Date }],
  remarks:      { type: String },
}, { timestamps: true });
module.exports = mongoose.model("Loan", loanSchema);
