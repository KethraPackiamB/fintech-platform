import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from "recharts";
import DashboardLayout from "../layouts/DashboardLayout";
import StatCard from "../components/ui-fintech/StatCard";
import { repaymentSeries } from "../services/mockData";
import { inr } from "../utils/format";

const disbursalData = [
  { month: "Jan", personal: 42, home: 18, business: 25 },
  { month: "Feb", personal: 38, home: 22, business: 28 },
  { month: "Mar", personal: 51, home: 19, business: 30 },
  { month: "Apr", personal: 48, home: 24, business: 33 },
  { month: "May", personal: 56, home: 27, business: 38 },
  { month: "Jun", personal: 60, home: 30, business: 42 },
];

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <h3 className="fw-bold mb-1">Analytics</h3>
      <p className="text-fin-muted mb-4">Portfolio performance, repayment trends, and loan mix.</p>
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            icon="bank"
            label="Portfolio AUM"
            value={inr(124800000)}
            delta={6.7}
            tone="info"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard icon="percent" label="Avg APR" value="11.8%" delta={-0.4} tone="success" />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard icon="speedometer" label="NPA ratio" value="2.1%" delta={-0.3} tone="warning" />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard icon="people" label="Active borrowers" value="3,284" delta={4.2} tone="info" />
        </div>
      </div>
      <div className="row g-3">
        <div className="col-12 col-xl-7">
          <div className="fin-card h-100">
            <h6 className="fw-bold mb-3">Disbursals by product (₹ Lakh)</h6>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={disbursalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--fin-border)" />
                <XAxis dataKey="month" stroke="var(--fin-muted)" />
                <YAxis stroke="var(--fin-muted)" />
                <Tooltip />
                <Legend />
                <Bar dataKey="personal" stackId="a" fill="#635bff" />
                <Bar dataKey="home" stackId="a" fill="#10b981" />
                <Bar dataKey="business" stackId="a" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="col-12 col-xl-5">
          <div className="fin-card h-100">
            <h6 className="fw-bold mb-3">Repayment trend</h6>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={repaymentSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--fin-border)" />
                <XAxis dataKey="month" stroke="var(--fin-muted)" />
                <YAxis stroke="var(--fin-muted)" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="scheduled" stroke="#635bff" strokeWidth={2} />
                <Line type="monotone" dataKey="received" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
