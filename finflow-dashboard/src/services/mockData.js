export const mockLoans = [
  {
    id: "LN-4821",
    borrower: "Aarav Mehta",
    amount: 250000,
    tenure: 24,
    status: "approved",
    emi: 11650,
    date: "2026-05-12",
  },
  {
    id: "LN-4822",
    borrower: "Priya Shah",
    amount: 80000,
    tenure: 12,
    status: "pending",
    emi: 7100,
    date: "2026-05-30",
  },
  {
    id: "LN-4823",
    borrower: "Rohan Verma",
    amount: 500000,
    tenure: 36,
    status: "under_review",
    emi: 16200,
    date: "2026-06-01",
  },
  {
    id: "LN-4824",
    borrower: "Neha Iyer",
    amount: 120000,
    tenure: 18,
    status: "rejected",
    emi: 7600,
    date: "2026-06-03",
  },
  {
    id: "LN-4825",
    borrower: "Vikram Singh",
    amount: 1000000,
    tenure: 60,
    status: "approved",
    emi: 21400,
    date: "2026-06-04",
  },
];

export const mockPayments = [
  {
    id: "PAY-9931",
    loan: "LN-4821",
    amount: 11650,
    method: "UPI",
    status: "success",
    date: "2026-06-01",
  },
  {
    id: "PAY-9932",
    loan: "LN-4825",
    amount: 21400,
    method: "Card",
    status: "success",
    date: "2026-06-02",
  },
  {
    id: "PAY-9933",
    loan: "LN-4822",
    amount: 7100,
    method: "NetBanking",
    status: "failed",
    date: "2026-06-03",
  },
  {
    id: "PAY-9934",
    loan: "LN-4821",
    amount: 11650,
    method: "UPI",
    status: "pending",
    date: "2026-06-05",
  },
];

export const mockFraud = [
  {
    id: "FR-201",
    user: "user_8821",
    risk: "high",
    reason: "Velocity check failed",
    time: "10m ago",
  },
  {
    id: "FR-202",
    user: "user_7712",
    risk: "medium",
    reason: "Device fingerprint mismatch",
    time: "1h ago",
  },
  {
    id: "FR-203",
    user: "user_5566",
    risk: "low",
    reason: "Unusual login geography",
    time: "3h ago",
  },
];

export const mockUsers = [
  { id: "u1", name: "Aarav Mehta", email: "aarav@example.com", role: "customer", status: "active" },
  { id: "u2", name: "Priya Shah", email: "priya@example.com", role: "customer", status: "active" },
  {
    id: "u3",
    name: "Karan Patel",
    email: "karan@bank.com",
    role: "loan_officer",
    status: "active",
  },
  { id: "u4", name: "Riya Kapoor", email: "riya@bank.com", role: "risk_analyst", status: "active" },
  { id: "u5", name: "Admin User", email: "admin@bank.com", role: "admin", status: "active" },
];

export const repaymentSeries = [
  { month: "Jan", scheduled: 320, received: 305 },
  { month: "Feb", scheduled: 340, received: 332 },
  { month: "Mar", scheduled: 360, received: 351 },
  { month: "Apr", scheduled: 380, received: 360 },
  { month: "May", scheduled: 410, received: 388 },
  { month: "Jun", scheduled: 430, received: 415 },
];

export const loanStatusBreakdown = [
  { name: "Approved", value: 412 },
  { name: "Pending", value: 128 },
  { name: "Under Review", value: 64 },
  { name: "Rejected", value: 41 },
];
