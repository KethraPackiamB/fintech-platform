import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import DashboardLayout from "../layouts/DashboardLayout";
import DataTable from "../components/ui-fintech/DataTable";
import Skeleton from "../components/ui-fintech/Skeleton";
import { inr } from "../utils/format";
import { roleAtom, userAtom } from "../store/atoms";
import { api } from "../api/axios";
import { endpoints } from "../api/endpoints";

export default function LoansPage() {
  const [filter, setFilter] = useState("all");
  const role = useAtomValue(roleAtom);
  const user = useAtomValue(userAtom);
  const isAdmin = ["admin", "super_admin", "loan_officer", "risk_analyst"].includes(role);

  const { data, isLoading } = useQuery({
    queryKey: ["loansList", role],
    queryFn: async () => {
      const endpoint = isAdmin ? endpoints.loans.adminList : endpoints.loans.list;
      const response = await api.get(endpoint);
      return response.data.data || [];
    },
  });

  const filteredLoans = (data || []).filter((l) => {
    if (filter === "all") return true;
    return l.status === filter;
  });

  const formatBorrower = (row) => {
    if (typeof row.user === "object") return row.user.name;
    return row.borrower || user?.name || "Customer";
  };

  const formatLoanId = (row) => {
    return `LN-${row._id?.slice(-4).toUpperCase()}`;
  };

  const formatAppliedDate = (row) => {
    if (row.createdAt) {
      return new Date(row.createdAt).toLocaleDateString();
    }
    return row.date || "N/A";
  };

  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h3 className="fw-bold mb-1">Loans</h3>
          <p className="text-fin-muted mb-0">Track applications, approvals, and disbursals.</p>
        </div>
        <Link to="/loans/apply" className="btn fin-btn-primary">
          <i className="bi bi-plus-lg me-1"></i> Apply for loan
        </Link>
      </div>
      <div className="fin-card">
        <div className="d-flex gap-2 mb-3 flex-wrap">
          {["all", "pending", "under_review", "approved", "rejected"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`btn btn-sm ${filter === s ? "fin-btn-primary" : "btn-outline-secondary"}`}
            >
              {s.replace("_", " ")}
            </button>
          ))}
        </div>
        {isLoading ? (
          <div className="d-flex flex-column gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} h={48} />
            ))}
          </div>
        ) : (
          <DataTable
            columns={[
              { key: "id", label: "Loan ID", render: (r) => formatLoanId(r) },
              { key: "borrower", label: "Borrower", render: (r) => formatBorrower(r) },
              { key: "amount", label: "Amount", render: (r) => inr(r.amount) },
              { key: "tenure", label: "Tenure", render: (r) => `${r.tenure} mo` },
              { key: "emi", label: "EMI", render: (r) => inr(r.emi) },
              { key: "date", label: "Applied", render: (r) => formatAppliedDate(r) },
              { key: "status", label: "Status", type: "status" },
            ]}
            rows={filteredLoans}
            empty="No loans match this filter"
          />
        )}
      </div>
    </DashboardLayout>
  );
}
