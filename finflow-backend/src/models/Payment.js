const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  user:          { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  loan:          { type: mongoose.Schema.Types.ObjectId, ref: "Loan" },
  amount:        { type: Number, required: true },
  type:          { type: String, enum: ["emi","transfer","deposit","withdrawal"], required: true },
  status:        { type: String, enum: ["pending","success","failed"], default: "pending" },
  transactionId: { type: String, unique: true },
  paymentMethod: { type: String, enum: ["card","upi","netbanking","wallet"] },
  description:   { type: String },
  paidAt:        { type: Date },
}, { timestamps: true });
module.exports = mongoose.model("Payment", paymentSchema);
