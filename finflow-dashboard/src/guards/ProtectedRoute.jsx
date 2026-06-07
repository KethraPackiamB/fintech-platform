import { Navigate } from "react-router-dom";
import { useAtomValue } from "jotai";
import { userAtom, roleAtom } from "../store/atoms";

export default function ProtectedRoute({ children, roles }) {
  const user = useAtomValue(userAtom);
  const role = useAtomValue(roleAtom);
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(role)) {
    return (
      <div className="container py-5">
        <div className="fin-card text-center">
          <i className="bi bi-shield-lock text-warning" style={{ fontSize: "2.5rem" }}></i>
          <h4 className="mt-3">Access denied</h4>
          <p className="text-fin-muted mb-0">Your role ({role}) cannot view this page.</p>
        </div>
      </div>
    );
  }
  return children;
}
