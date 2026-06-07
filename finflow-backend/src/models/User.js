const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name:         { type: String, required: true, trim: true },
  email:        { type: String, required: true, unique: true, lowercase: true },
  password:     { type: String, required: true, select: false },
  phone:        { type: String },
  role:         { type: String, enum: ["user", "admin", "customer", "loan_officer", "risk_analyst", "super_admin"], default: "customer" },
  isVerified:   { type: Boolean, default: false },
  profileImage: { type: String },
  refreshToken: { type: String, select: false },
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
userSchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};
module.exports = mongoose.model("User", userSchema);
