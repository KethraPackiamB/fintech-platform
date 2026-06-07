import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import DashboardLayout from "../layouts/DashboardLayout";
import { userAtom } from "../store/atoms";
import { api } from "../api/axios";
import { endpoints } from "../api/endpoints";
import Skeleton from "../components/ui-fintech/Skeleton";

const MAX = 900;

const defaultFactors = [
  { label: "Payment history", weight: 35, value: 92, tone: "success" },
  { label: "Credit utilisation", weight: 30, value: 68, tone: "warning" },
  { label: "Credit age", weight: 15, value: 80, tone: "success" },
  { label: "Credit mix", weight: 10, value: 74, tone: "info" },
  { label: "Recent enquiries", weight: 10, value: 55, tone: "danger" },
];

function ScoreRing({ score }) {
  const r = 80,
    c = 2 * Math.PI * r,
    pct = score / MAX,
    dash = c * pct;
  const color = score > 740 ? "#10b981" : score > 650 ? "#f59e0b" : "#ef4444";
  return (
    <svg width="200" height="200" viewBox="0 0 200 200">
      <circle cx="100" cy="100" r={r} stroke="var(--fin-border)" strokeWidth="14" fill="none" />
      <circle
        cx="100"
        cy="100"
        r={r}
        stroke={color}
        strokeWidth="14"
        fill="none"
        strokeDasharray={`${dash} ${c}`}
        strokeLinecap="round"
        transform="rotate(-90 100 100)"
      />
      <text
        x="100"
        y="98"
        textAnchor="middle"
        fontSize="38"
        fontWeight="700"
        fill="var(--fin-text)"
      >
        {score}
      </text>
      <text x="100" y="120" textAnchor="middle" fontSize="12" fill="var(--fin-muted)">
        out of {MAX}
      </text>
    </svg>
  );
}

export default function CreditScorePage() {
  const user = useAtomValue(userAtom);

  const { data: scoreData, isLoading } = useQuery({
    queryKey: ["creditScore"],
    queryFn: async () => {
      const response = await api.get(endpoints.creditScore.me);
      return response.data.data;
    },
  });

  const score = scoreData?.score || 720;
  const rating = scoreData?.grade || "Good";

  const dbFactors = scoreData?.factors || [];
  const displayFactors = dbFactors.length > 0
    ? dbFactors.map((f) => ({
        label: f.name,
        weight: f.name.toLowerCase().includes("payment") ? 35 : 30,
        value: f.impact === "positive" ? 95 : f.impact === "neutral" ? 70 : 45,
        tone: f.impact === "positive" ? "success" : f.impact === "neutral" ? "warning" : "danger",
      }))
    : defaultFactors;

  return (
    <DashboardLayout>
      <h3 className="fw-bold mb-1">Credit score</h3>
      <p className="text-fin-muted mb-4">AI-powered scoring across 5 financial factors.</p>
      {isLoading ? (
        <div className="row g-3">
          <div className="col-12 col-lg-5">
            <Skeleton h={350} />
          </div>
          <div className="col-12 col-lg-7">
            <Skeleton h={350} />
          </div>
        </div>
      ) : (
        <div className="row g-3">
          <div className="col-12 col-lg-5">
            <div className="fin-card text-center h-100">
              <ScoreRing score={score} />
              <h5 className="fw-bold mt-2 mb-0">{rating}</h5>
              <p className="text-fin-muted">{user?.name || "Customer"} · Updated today</p>
              <div className="d-flex justify-content-around text-start small mt-3">
                <div>
                  <span className="fin-badge danger">Poor</span>
                  <div className="text-fin-muted">300–579</div>
                </div>
                <div>
                  <span className="fin-badge warning">Fair</span>
                  <div className="text-fin-muted">580–669</div>
                </div>
                <div>
                  <span className="fin-badge info">Good</span>
                  <div className="text-fin-muted">670–739</div>
                </div>
                <div>
                  <span className="fin-badge success">Excellent</span>
                  <div className="text-fin-muted">740+</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-7">
            <div className="fin-card h-100">
              <h6 className="fw-bold mb-3">Score breakdown</h6>
              {displayFactors.map((f) => (
                <div key={f.label} className="mb-3">
                  <div className="d-flex justify-content-between small fw-semibold">
                    <span>
                      {f.label} <span className="text-fin-muted fw-normal">({f.weight}% weight)</span>
                    </span>
                    <span>{f.value}/100</span>
                  </div>
                  <div className="progress" style={{ height: 8 }}>
                    <div
                      className={`progress-bar bg-${f.tone === "info" ? "primary" : f.tone}`}
                      style={{ width: `${f.value}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="fin-divider my-3"></div>
              <h6 className="fw-bold mb-2">Eligibility prediction</h6>
              <div className="row text-center">
                <div className="col">
                  <div className="text-fin-muted small">Max loan</div>
                  <div className="fw-bold">
                    {score > 740 ? "₹18,00,000" : score > 670 ? "₹10,00,000" : "₹5,00,000"}
                  </div>
                </div>
                <div className="col">
                  <div className="text-fin-muted small">Best rate</div>
                  <div className="fw-bold">{score > 740 ? "9.4%" : score > 670 ? "11.2%" : "14.5%"}</div>
                </div>
                <div className="col">
                  <div className="text-fin-muted small">Approval odds</div>
                  <div className={`fw-bold text-${score > 670 ? "success" : "warning"}`}>
                    {score > 740 ? "94%" : score > 670 ? "82%" : "45%"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
