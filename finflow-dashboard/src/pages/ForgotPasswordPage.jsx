import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import { useToast } from "../app/AppProviders";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const toast = useToast();
  const submit = (e) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setSent(true);
    toast("Reset link sent to your email", "success");
  };
  return (
    <AuthLayout title="Reset password" subtitle="We'll email you a secure reset link">
      {sent ? (
        <div className="fin-card text-center">
          <i className="bi bi-envelope-check text-success" style={{ fontSize: "2rem" }}></i>
          <h5 className="mt-2">Check your inbox</h5>
          <p className="text-fin-muted small">
            If an account exists for {email}, we've sent reset instructions.
          </p>
          <Link to="/login" className="btn fin-btn-primary mt-2">
            Back to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button className="btn fin-btn-primary w-100">Send reset link</button>
          <p className="text-center small mt-3 mb-0">
            <Link to="/login">Back to sign in</Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}
