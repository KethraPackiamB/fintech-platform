const mongoose = require("mongoose");

const creditScoreSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  score:   { type: Number, min: 300, max: 900 },
  grade:   { type: String, enum: ["Poor","Fair","Good","Very Good","Excellent"] },
  factors: [{ name: String, impact: String, description: String }],
  history: [{ score: Number, recordedAt: Date }],
}, { timestamps: true });
module.exports = mongoose.model("CreditScore", creditScoreSchema);
