import { useState } from "react";
import { useSetAtom } from "jotai";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import { userAtom, accessTokenAtom } from "../store/atoms";
import { useToast } from "../app/AppProviders";

import { authService } from "../services/authService";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const setUser = useSetAtom(userAtom);
  const setToken = useSetAtom(accessTokenAtom);
  const navigate = useNavigate();
  const toast = useToast();

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (form.name.trim().length < 2) return setError("Enter your full name.");
    if (!form.email.includes("@")) return setError("Enter a valid email.");
    if (form.password.length < 8) return setError("Password must be at least 8 characters.");
    setError("");
    try {
      const response = await authService.register(form);
      const { user, accessToken } = response.data;
      setUser(user);
      setToken(accessToken);
      toast("Account created — welcome to FinCore", "success");
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Registration failed");
    }
  };

  return (
    <AuthLayout title="Create account" subtitle="Start your fintech journey in seconds">
      <form onSubmit={submit} noValidate>
        {error && <div className="alert alert-danger py-2 small">{error}</div>}
        <div className="mb-3">
          <label className="form-label small fw-semibold">Full name</label>
          <input
            className="form-control"
            value={form.name}
            onChange={update("name")}
            maxLength={100}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label small fw-semibold">Email</label>
          <input
            type="email"
            className="form-control"
            value={form.email}
            onChange={update("email")}
            maxLength={255}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label small fw-semibold">Password</label>
          <input
            type="password"
            className="form-control"
            value={form.password}
            onChange={update("password")}
            minLength={8}
            maxLength={128}
            required
          />
        </div>
        <button className="btn fin-btn-primary w-100">Create account</button>
        <p className="text-center text-fin-muted small mt-3 mb-0">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
