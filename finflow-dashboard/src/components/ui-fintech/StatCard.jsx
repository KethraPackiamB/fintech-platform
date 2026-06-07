export default function StatCard({ icon, label, value, delta, tone = "info" }) {
  const toneBg = {
    info: "rgba(99,91,255,.12)",
    success: "rgba(16,185,129,.12)",
    warning: "rgba(245,158,11,.14)",
    danger: "rgba(239,68,68,.12)",
  }[tone];
  const toneColor = {
    info: "var(--fin-primary)",
    success: "#059669",
    warning: "#b45309",
    danger: "#dc2626",
  }[tone];
  return (
    <div className="fin-card h-100">
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <div className="text-fin-muted small">{label}</div>
          <div className="fs-3 fw-bold mt-1">{value}</div>
          {delta != null && (
            <div className={`small mt-1 ${delta >= 0 ? "text-success" : "text-danger"}`}>
              <i className={`bi bi-arrow-${delta >= 0 ? "up" : "down"}-right`}></i>{" "}
              {Math.abs(delta)}% vs last month
            </div>
          )}
        </div>
        <span className="fin-stat-icon" style={{ background: toneBg, color: toneColor }}>
          <i className={`bi bi-${icon}`}></i>
        </span>
      </div>
    </div>
  );
}
