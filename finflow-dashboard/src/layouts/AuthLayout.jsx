export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-vh-100 d-flex" style={{ background: "var(--fin-bg)" }}>
      <div
        className="d-none d-lg-flex flex-column justify-content-between p-5"
        style={{
          flex: 1,
          background: "linear-gradient(135deg, #0a2540 0%, #635bff 100%)",
          color: "#fff",
        }}
      >
        <div className="d-flex align-items-center gap-2 fs-4 fw-bold">
          <i className="bi bi-bank2"></i> FinCore
        </div>
        <div>
          <h2 className="fw-bold">Smart lending, intelligent decisions.</h2>
          <p className="opacity-75">
            AI-powered credit scoring, instant loan approvals, and enterprise-grade fraud detection
            — all in one platform.
          </p>
        </div>
        <div className="small opacity-50">© {new Date().getFullYear()} FinCore</div>
      </div>
      <div className="d-flex align-items-center justify-content-center p-4" style={{ flex: 1 }}>
        <div style={{ width: "100%", maxWidth: 420 }}>
          <h3 className="fw-bold mb-1">{title}</h3>
          <p className="text-fin-muted mb-4">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
