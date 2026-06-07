import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div
      className="min-vh-100"
      style={{
        background: "linear-gradient(135deg, #0a2540 0%, #1a1a4e 50%, #635bff 100%)",
        color: "#fff",
      }}
    >
      <nav className="d-flex justify-content-between align-items-center p-4">
        <div className="fs-4 fw-bold">
          <i className="bi bi-bank2 me-2" />
          FinCore
        </div>
        <div className="d-flex gap-2">
          <Link to="/login" className="btn btn-outline-light btn-sm">
            Sign in
          </Link>
          <Link to="/register" className="btn btn-light btn-sm text-primary fw-semibold">
            Get started
          </Link>
        </div>
      </nav>
      <div className="container py-5 text-center">
        <span className="badge bg-light text-primary px-3 py-2 mb-3">
          AI-powered fintech infrastructure
        </span>
        <h1 className="display-4 fw-bold mb-3">
          Smart lending,
          <br />
          intelligent decisions.
        </h1>
        <p className="lead opacity-75 mx-auto" style={{ maxWidth: 640 }}>
          End-to-end loan origination, credit scoring, KYC, fraud detection, and Razorpay-powered
          payments — built for modern lenders.
        </p>
        <div className="d-flex justify-content-center gap-2 mt-4">
          <Link to="/dashboard" className="btn btn-light btn-lg fw-semibold text-primary">
            Open dashboard
          </Link>
          <Link to="/login" className="btn btn-outline-light btn-lg">
            Sign in
          </Link>
        </div>
        <div className="row g-3 mt-5">
          {[
            { i: "graph-up-arrow", t: "Credit Scoring", d: "0–1000 AI score with full breakdown" },
            { i: "shield-check", t: "Fraud Detection", d: "Real-time anomaly alerts" },
            {
              i: "credit-card-2-front",
              t: "Razorpay Payments",
              d: "EMI, invoices & subscriptions",
            },
            { i: "person-vcard", t: "KYC & Onboarding", d: "Automated identity verification" },
          ].map((f) => (
            <div key={f.t} className="col-6 col-md-3">
              <div className="p-3 rounded-3 h-100" style={{ background: "rgba(255,255,255,.08)" }}>
                <i className={`bi bi-${f.i} fs-2`} />
                <div className="fw-semibold mt-2">{f.t}</div>
                <div className="small opacity-75">{f.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
