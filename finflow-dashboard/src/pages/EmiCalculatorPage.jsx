import { useState, useMemo } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import DashboardLayout from "../layouts/DashboardLayout";
import { inr, emiCalc } from "../utils/format";

export default function EmiCalculatorPage() {
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(10.5);
  const [tenure, setTenure] = useState(36);

  const { emi, totalInterest, totalPayment, chart } = useMemo(() => {
    const e = emiCalc(amount, rate, tenure);
    const total = e * tenure;
    const interest = total - amount;
    return {
      emi: e,
      totalInterest: interest,
      totalPayment: total,
      chart: [
        { name: "Principal", value: amount },
        { name: "Interest", value: interest },
      ],
    };
  }, [amount, rate, tenure]);

  return (
    <DashboardLayout>
      <h3 className="fw-bold mb-1">EMI Calculator</h3>
      <p className="text-fin-muted mb-4">Estimate monthly installments before you apply.</p>
      <div className="row g-3">
        <div className="col-12 col-lg-6">
          <div className="fin-card h-100">
            <div className="mb-4">
              <label className="form-label fw-semibold d-flex justify-content-between">
                Loan amount <span>{inr(amount)}</span>
              </label>
              <input
                type="range"
                className="form-range"
                min={10000}
                max={5000000}
                step={10000}
                value={amount}
                onChange={(e) => setAmount(+e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="form-label fw-semibold d-flex justify-content-between">
                Interest rate <span>{rate}%</span>
              </label>
              <input
                type="range"
                className="form-range"
                min={5}
                max={30}
                step={0.1}
                value={rate}
                onChange={(e) => setRate(+e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label className="form-label fw-semibold d-flex justify-content-between">
                Tenure <span>{tenure} months</span>
              </label>
              <input
                type="range"
                className="form-range"
                min={3}
                max={84}
                step={1}
                value={tenure}
                onChange={(e) => setTenure(+e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-6">
          <div className="fin-card h-100">
            <div className="row text-center mb-3">
              <div className="col-4">
                <div className="text-fin-muted small">Monthly EMI</div>
                <div className="fs-5 fw-bold">{inr(emi)}</div>
              </div>
              <div className="col-4">
                <div className="text-fin-muted small">Interest</div>
                <div className="fs-5 fw-bold">{inr(totalInterest)}</div>
              </div>
              <div className="col-4">
                <div className="text-fin-muted small">Total Payable</div>
                <div className="fs-5 fw-bold">{inr(totalPayment)}</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={chart}
                  dataKey="value"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={2}
                >
                  <Cell fill="#635bff" />
                  <Cell fill="#f59e0b" />
                </Pie>
                <Tooltip formatter={(v) => inr(v)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
