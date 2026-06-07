import { useAtomValue } from "jotai";
import { useQuery } from "@tanstack/react-query";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import DashboardLayout from "../layouts/DashboardLayout";
import StatCard from "../components/ui-fintech/StatCard";
import DataTable from "../components/ui-fintech/DataTable";
import Skeleton from "../components/ui-fintech/Skeleton";
import { inr, num } from "../utils/format";
import { roleAtom, userAtom } from "../store/atoms";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import { endpoints } from "../api/endpoints";

const COLORS = ["#10b981", "#f59e0b", "#635bff", "#ef4444"];

export default function DashboardPage() {
  const role = useAtomValue(roleAtom);
  const user = useAtomValue(userAtom);
  const navigate = useNavigate();
  const isAdmin = ["admin", "super_admin", "loan_officer", "risk_analyst"].includes(role);

  // Fetch Loans
  const { data: loansResponse, isLoading: isLoansLoading } = useQuery({
    queryKey: ["dashboardLoans", role],
    queryFn: async () => {
      const endpoint = isAdmin ? endpoints.loans.adminList : endpoints.loans.list;
      const response = await api.get(endpoint);
      return response.data.data || [];
    },
  });

  // Fetch Dashboard Stats (only for admin or general overview)
  const { data: statsResponse, isLoading: isStatsLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const response = await api.get(endpoints.analytics.overview);
      return response.data.data || {};
    },
  });

  // Fetch Fraud alerts (to count risk alerts if admin)
  const { data: fraudResponse } = useQuery({
    queryKey: ["dashboardFraud"],
    queryFn: async () => {
      if (!isAdmin) return [];
      const response = await api.get(endpoints.fraud.list);
      return response.data.data || [];
    },
    enabled: isAdmin,
  });

  const loans = loansResponse || [];
  const stats = statsResponse || {};
  const activeAlertsCount = (fraudResponse || []).filter((a) => a.status === "open" || a.status === "investigating").length;

  // Calculate dynamic stats
  let totalDisbursed = 0;
  let activeLoansCount = 0;
  let pendingApprovalsCount = 0;
  let riskAlertsCount = 0;

  if (isAdmin) {
    totalDisbursed = stats.totalDisbursed || 0;
    activeLoansCount = stats.totalLoans || 0; // count of all loans in system
    pendingApprovalsCount = loans.filter((l) => l.status === "pending" || l.status === "under_review").length;
    riskAlertsCount = activeAlertsCount;
  } else {
    // Customer calculations
    totalDisbursed = loans.filter((l) => l.status === "disbursed" || l.status === "approved").reduce((sum, l) => sum + l.amount, 0);
    activeLoansCount = loans.filter((l) => l.status === "disbursed" || l.status === "approved").length;
    pendingApprovalsCount = loans.filter((l) => l.status === "pending" || l.status === "under_review").length;
    riskAlertsCount = 0; // Customers don't see system-wide fraud alerts
  }

  // Calculate dynamic Pie Chart data
  const statusCounts = loans.reduce((acc, loan) => {
    const s = loan.status;
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const loanStatusBreakdown = [
    { name: "Approved / Disbursed", value: (statusCounts["approved"] || 0) + (statusCounts["disbursed"] || 0) },
    { name: "Pending", value: statusCounts["pending"] || 0 },
    { name: "Under Review", value: statusCounts["under_review"] || 0 },
    { name: "Rejected", value: statusCounts["rejected"] || 0 },
  ].filter((item) => item.value > 0);

  // Fallback for pie chart if empty
  const pieChartData = loanStatusBreakdown.length > 0 ? loanStatusBreakdown : [{ name: "No Loans", value: 1 }];

  // Hardcode repaymentSeries for visual style as it is historical trend
  const repaymentSeries = [
    { month: "Jan", scheduled: 320, received: 305 },
    { month: "Feb", scheduled: 340, received: 332 },
    { month: "Mar", scheduled: 360, received: 351 },
    { month: "Apr", scheduled: 380, received: 360 },
    { month: "May", scheduled: 410, received: 388 },
    { month: "Jun", scheduled: 430, received: 415 },
  ];

  const recentLoans = loans.slice(0, 5);

  const formatBorrower = (row) => {
    if (typeof row.user === "object") return row.user.name;
    return row.borrower || user?.name || "Customer";
  };

  const formatLoanId = (row) => {
    return `LN-${row._id?.slice(-4).toUpperCase()}`;
  };

  const isLoading = isLoansLoading || (isAdmin && isStatsLoading);

  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-end flex-wrap gap-2 mb-4">
        <div>
          <h3 className="fw-bold mb-1">Welcome back, {user?.name?.split(" ")[0] || "there"}</h3>
          <p className="text-fin-muted mb-0">
            Here's what's happening across your portfolio today.
          </p>
        </div>
        <button className="btn fin-btn-primary" onClick={() => navigate("/loans/apply")}>
          <i className="bi bi-plus-lg me-1"></i> New Loan
        </button>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            icon="cash-stack"
            label={isAdmin ? "Total Portfolio Disbursed" : "Your Total Disbursed"}
            value={isLoading ? "..." : inr(totalDisbursed)}
            delta={isAdmin ? 12.4 : undefined}
            tone="info"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            icon="check2-circle"
            label={isAdmin ? "Active System Loans" : "Your Active Loans"}
            value={isLoading ? "..." : num(activeLoansCount)}
            delta={isAdmin ? 3.2 : undefined}
            tone="success"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            icon="hourglass-split"
            label="Pending Approvals"
            value={isLoading ? "..." : num(pendingApprovalsCount)}
            delta={isAdmin ? -8.1 : undefined}
            tone="warning"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            icon="shield-exclamation"
            label={isAdmin ? "Active Fraud Alerts" : "Risk Incidents"}
            value={isLoading ? "..." : num(riskAlertsCount)}
            delta={isAdmin ? -1.5 : undefined}
            tone="danger"
          />
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-xl-8">
          <div className="fin-card h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold mb-0">Repayments overview</h6>
              <span className="fin-badge info">Last 6 months</span>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={repaymentSeries}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#635bff" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#635bff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--fin-border)" />
                <XAxis dataKey="month" stroke="var(--fin-muted)" />
                <YAxis stroke="var(--fin-muted)" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="scheduled"
                  stroke="#635bff"
                  fill="url(#g1)"
                  name="Scheduled (₹L)"
                />
                <Area
                  type="monotone"
                  dataKey="received"
                  stroke="#10b981"
                  fill="url(#g2)"
                  name="Received (₹L)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="col-12 col-xl-4">
          <div className="fin-card h-100">
            <h6 className="fw-bold mb-3">Loan status breakdown</h6>
            {isLoading ? (
              <Skeleton h={280} />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={2}
                  >
                    {pieChartData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="fin-card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="fw-bold mb-0">Recent loans</h6>
          <span className="text-fin-muted small">Showing latest 5 · Role: {role.replace("_", " ")}</span>
        </div>
        {isLoading ? (
          <div className="d-flex flex-column gap-2">
            <Skeleton h={40} />
            <Skeleton h={40} />
            <Skeleton h={40} />
          </div>
        ) : (
          <DataTable
            columns={[
              { key: "id", label: "Loan ID", render: (r) => formatLoanId(r) },
              { key: "borrower", label: "Borrower", render: (r) => formatBorrower(r) },
              { key: "amount", label: "Amount", render: (r) => inr(r.amount) },
              { key: "tenure", label: "Tenure", render: (r) => `${r.tenure} mo` },
              { key: "emi", label: "EMI", render: (r) => inr(r.emi) },
              { key: "status", label: "Status", type: "status" },
            ]}
            rows={recentLoans}
            empty="No loans applied yet"
          />
        )}
      </div>
    </DashboardLayout>
  );
}
