import { useState } from "react";
import { useSetAtom } from "jotai";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import { userAtom, accessTokenAtom } from "../store/atoms";
import { useToast } from "../app/AppProviders";

const DEMO_USERS = {
  "customer@demo.com": { name: "Aarav Mehta", role: "customer" },
  "officer@demo.com": { name: "Karan Patel", role: "loan_officer" },
  "risk@demo.com": { name: "Riya Kapoor", role: "risk_analyst" },
  "admin@demo.com": { name: "Admin User", role: "admin" },
  "superadmin@demo.com": { name: "Super Admin", role: "super_admin" },
};

import { authService } from "../services/authService";

export default function LoginPage() {
  const [email, setEmail] = useState("customer@demo.com");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const setUser = useSetAtom(userAtom);
  const setToken = useSetAtom(accessTokenAtom);
  const navigate = useNavigate();
  const toast = useToast();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.includes("@") || password.length < 6) {
      setError("Enter a valid email and a password of at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      const { user, accessToken } = response.data;
      setUser(user);
      setToken(accessToken);
      toast(`Welcome back, ${user.name}`, "success");
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Sign in" subtitle="Access your FinCore dashboard">
      <form onSubmit={onSubmit} noValidate>
        {error && <div className="alert alert-danger py-2 small">{error}</div>}
        <div className="mb-3">
          <label className="form-label small fw-semibold">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            maxLength={255}
          />
        </div>
        <div className="mb-3">
          <label className="form-label small fw-semibold d-flex justify-content-between">
            <span>Password</span>
            <Link to="/forgot-password" className="text-decoration-none small">
              Forgot?
            </Link>
          </label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            maxLength={128}
          />
        </div>
        <button className="btn fin-btn-primary w-100" disabled={loading}>
          {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
          Sign in
        </button>
        <p className="text-center text-fin-muted small mt-3 mb-2">
          No account? <Link to="/register">Create one</Link>
        </p>
        <div
          className="fin-card mt-3"
          style={{ background: "rgba(99,91,255,.06)", borderColor: "transparent" }}
        >
          <div className="small fw-semibold mb-1">Demo accounts</div>
          <div className="small text-fin-muted">
            customer@demo.com · officer@demo.com · risk@demo.com · admin@demo.com
            <br />
            password: <code>demo1234</code>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
}
