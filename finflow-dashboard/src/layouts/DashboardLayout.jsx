import { useAtom, useAtomValue } from "jotai";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { sidebarOpenAtom, themeAtom, userAtom, notificationsAtom, roleAtom } from "../store/atoms";

const NAV = [
  {
    section: "Overview",
    items: [
      {
        to: "/dashboard",
        label: "Dashboard",
        icon: "speedometer2",
        roles: ["customer", "loan_officer", "admin", "risk_analyst", "super_admin"],
      },
      {
        to: "/analytics",
        label: "Analytics",
        icon: "bar-chart",
        roles: ["loan_officer", "admin", "risk_analyst", "super_admin"],
      },
    ],
  },
  {
    section: "Lending",
    items: [
      {
        to: "/loans",
        label: "Loans",
        icon: "cash-coin",
        roles: ["customer", "loan_officer", "admin", "super_admin"],
      },
      {
        to: "/loans/apply",
        label: "Apply for Loan",
        icon: "file-earmark-plus",
        roles: ["customer"],
      },
      {
        to: "/emi-calculator",
        label: "EMI Calculator",
        icon: "calculator",
        roles: ["customer", "loan_officer", "admin", "risk_analyst", "super_admin"],
      },
      {
        to: "/credit-score",
        label: "Credit Score",
        icon: "graph-up-arrow",
        roles: ["customer", "loan_officer", "risk_analyst", "admin", "super_admin"],
      },
      {
        to: "/kyc",
        label: "KYC Verification",
        icon: "person-vcard",
        roles: ["customer", "loan_officer", "admin", "super_admin"],
      },
    ],
  },
  {
    section: "Payments",
    items: [
      {
        to: "/payments",
        label: "Payments",
        icon: "credit-card-2-front",
        roles: ["customer", "admin", "super_admin"],
      },
    ],
  },
  {
    section: "Risk",
    items: [
      {
        to: "/fraud",
        label: "Fraud Detection",
        icon: "shield-exclamation",
        roles: ["risk_analyst", "admin", "super_admin"],
      },
    ],
  },
  {
    section: "Administration",
    items: [
      { to: "/admin", label: "Admin Panel", icon: "people", roles: ["admin", "super_admin"] },
    ],
  },
];

export default function DashboardLayout({ children }) {
  const [open, setOpen] = useAtom(sidebarOpenAtom);
  const [theme, setTheme] = useAtom(themeAtom);
  const [user, setUser] = useAtom(userAtom);
  const notifs = useAtomValue(notificationsAtom);
  const role = useAtomValue(roleAtom);
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const logout = () => {
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="fin-shell">
      {open && <div className="fin-backdrop d-lg-none" onClick={() => setOpen(false)} />}
      <aside className={`fin-sidebar ${open ? "open" : ""}`}>
        <div className="brand">
          <i className="bi bi-bank2"></i> FinCore
        </div>
        {NAV.map((sec) => {
          const items = sec.items.filter((i) => i.roles.includes(role));
          if (!items.length) return null;
          return (
            <div key={sec.section}>
              <div className="nav-section">{sec.section}</div>
              {items.map((i) => (
                <Link
                  key={i.to}
                  to={i.to}
                  className={`nav-link ${path === i.to ? "active" : ""}`}
                  onClick={() => setOpen(false)}
                >
                  <i className={`bi bi-${i.icon}`}></i>
                  <span>{i.label}</span>
                </Link>
              ))}
            </div>
          );
        })}
        <div className="mt-auto px-2 pt-3 small" style={{ color: "#5b6b80" }}>
          v1.0.0 · {role}
        </div>
      </aside>
      <div className="fin-main">
        <header className="fin-topbar">
          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-sm btn-light d-lg-none" onClick={() => setOpen(true)}>
              <i className="bi bi-list"></i>
            </button>
            <div className="input-group" style={{ maxWidth: 360 }}>
              <span className="input-group-text bg-transparent border-end-0">
                <i className="bi bi-search"></i>
              </span>
              <input
                className="form-control border-start-0"
                placeholder="Search loans, users, payments..."
              />
            </div>
          </div>
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-sm btn-light"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <i className={`bi bi-${theme === "dark" ? "sun" : "moon-stars"}`}></i>
            </button>
            <div className="dropdown">
              <button className="btn btn-sm btn-light position-relative" data-bs-toggle="dropdown">
                <i className="bi bi-bell"></i>
                {notifs.length > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    style={{ fontSize: ".55rem" }}
                  >
                    {notifs.length}
                  </span>
                )}
              </button>
              <ul className="dropdown-menu dropdown-menu-end p-0" style={{ minWidth: 320 }}>
                <li className="px-3 py-2 fw-semibold border-bottom">Notifications</li>
                {notifs.map((n) => (
                  <li key={n.id} className="px-3 py-2 border-bottom">
                    <div className="small fw-semibold">{n.title}</div>
                    <div className="text-fin-muted" style={{ fontSize: ".75rem" }}>
                      {n.time}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="dropdown">
              <button
                className="btn btn-sm btn-light d-flex align-items-center gap-2"
                data-bs-toggle="dropdown"
              >
                <span
                  className="rounded-circle d-inline-flex align-items-center justify-content-center"
                  style={{
                    width: 28,
                    height: 28,
                    background: "var(--fin-primary)",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: ".8rem",
                  }}
                >
                  {(user?.name || "U").slice(0, 1).toUpperCase()}
                </span>
                <span className="d-none d-md-inline">{user?.name || "Guest"}</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <span className="dropdown-item-text small text-fin-muted">{user?.email}</span>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button className="dropdown-item" onClick={logout}>
                    <i className="bi bi-box-arrow-right me-2"></i>Sign out
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </header>
        <main className="fin-content">{children}</main>
      </div>
    </div>
  );
}
