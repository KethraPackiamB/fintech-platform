export const inr = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n || 0);

export const num = (n) => new Intl.NumberFormat("en-IN").format(n || 0);

export const emiCalc = (principal, annualRate, months) => {
  const r = annualRate / 12 / 100;
  if (!r) return principal / months;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
};

export const statusBadge = (s) => {
  const map = {
    approved: "success",
    success: "success",
    active: "success",
    pending: "warning",
    under_review: "info",
    rejected: "danger",
    failed: "danger",
    high: "danger",
    medium: "warning",
    low: "info",
  };
  return map[s] || "info";
};
