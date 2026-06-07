/**
 * EMI = P * r * (1+r)^n / ((1+r)^n - 1)
 * P = principal, r = monthly rate, n = tenure (months)
 */
exports.calculateEMI = (principal, annualRate, tenureMonths) => {
  const r = annualRate / 12 / 100;
  if (r === 0) return principal / tenureMonths;
  const emi = (principal * r * Math.pow(1 + r, tenureMonths)) / (Math.pow(1 + r, tenureMonths) - 1);
  return Math.round(emi * 100) / 100;
};
