import { useQuery, useMutation } from "@tanstack/react-query";
import DashboardLayout from "../layouts/DashboardLayout";
import DataTable from "../components/ui-fintech/DataTable";
import StatCard from "../components/ui-fintech/StatCard";
import Skeleton from "../components/ui-fintech/Skeleton";
import { inr } from "../utils/format";
import { useToast } from "../app/AppProviders";
import { api } from "../api/axios";
import { endpoints } from "../api/endpoints";

export default function AdminPage() {
  const toast = useToast();

  // Query users
  const { data: usersResponse, isLoading: isUsersLoading, refetch: refetchUsers } = useQuery({
    queryKey: ["adminUsersList"],
    queryFn: async () => {
      const response = await api.get(endpoints.users.list);
      return response.data.data || [];
    },
  });

  // Query loans
  const { data: loansResponse, isLoading: isLoansLoading, refetch: refetchLoans } = useQuery({
    queryKey: ["adminLoansList"],
    queryFn: async () => {
      const response = await api.get(endpoints.loans.adminList);
      return response.data.data || [];
    },
  });

  // Mutation to update loan status
  const updateLoanMutation = useMutation({
    mutationFn: async ({ id, status, remarks }) => {
      const response = await api.patch(endpoints.loans.updateStatus(id), { status, remarks });
      return response.data;
    },
    onSuccess: (_, variables) => {
      toast(`Loan status updated to ${variables.status}`, "success");
      refetchLoans();
    },
    onError: (err) => {
      toast(err?.response?.data?.message || err?.message || "Failed to update loan status", "danger");
    },
  });

  // Mutation to verify user KYC
  const verifyKycMutation = useMutation({
    mutationFn: async ({ userId, status, remarks }) => {
      const response = await api.patch(endpoints.kyc.verify(userId), { status, remarks });
      return response.data;
    },
    onSuccess: (_, variables) => {
      toast(`User KYC marked as ${variables.status}`, "success");
      refetchUsers();
    },
    onError: (err) => {
      toast(err?.response?.data?.message || err?.message || "Failed to verify KYC", "danger");
    },
  });

  const users = usersResponse || [];
  const loans = loansResponse || [];
  const pendingLoans = loans.filter((l) => l.status === "pending" || l.status === "under_review");

  const handleLoanDecision = (id, status) => {
    updateLoanMutation.mutate({
      id,
      status,
      remarks: `Processed by administrator. Status: ${status}`,
    });
  };

  const handleKycDecision = (userId, status) => {
    verifyKycMutation.mutate({
      userId,
      status,
      remarks: `KYC ${status} by Administrator`,
    });
  };

  const isLoading = isUsersLoading || isLoansLoading;

  return (
    <DashboardLayout>
      <h3 className="fw-bold mb-1">Admin Panel</h3>
      <p className="text-fin-muted mb-4">User management, loan approvals, and system health.</p>

      {isLoading ? (
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-6 col-xl-3"><Skeleton h={80} /></div>
          <div className="col-12 col-sm-6 col-xl-3"><Skeleton h={80} /></div>
          <div className="col-12 col-sm-6 col-xl-3"><Skeleton h={80} /></div>
          <div className="col-12 col-sm-6 col-xl-3"><Skeleton h={80} /></div>
        </div>
      ) : (
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-6 col-xl-3">
            <StatCard icon="people-fill" label="Total users" value={users.length.toString()} tone="info" />
          </div>
          <div className="col-12 col-sm-6 col-xl-3">
            <StatCard
              icon="hourglass"
              label="Loans awaiting review"
              value={pendingLoans.length.toString()}
              tone="warning"
            />
          </div>
          <div className="col-12 col-sm-6 col-xl-3">
            <StatCard icon="heart-pulse" label="System uptime" value="99.98%" tone="success" />
          </div>
          <div className="col-12 col-sm-6 col-xl-3">
            <StatCard icon="bug" label="Open incidents" value="0" tone="success" />
          </div>
        </div>
      )}

      <div className="fin-card mb-4">
        <h6 className="fw-bold mb-3">Approval queue</h6>
        {isLoading ? (
          <div className="d-flex flex-column gap-2">
            <Skeleton h={40} />
            <Skeleton h={40} />
          </div>
        ) : (
          <DataTable
            columns={[
              { key: "id", label: "Loan", render: (r) => `LN-${r._id.slice(-4).toUpperCase()}` },
              {
                key: "borrower",
                label: "Borrower",
                render: (r) => (typeof r.user === "object" ? r.user.name : r.borrower || "Customer"),
              },
              { key: "amount", label: "Amount", render: (r) => inr(r.amount) },
              { key: "status", label: "Status", type: "status" },
              {
                key: "action",
                label: "Decision",
                render: (r) => (
                  <div className="d-flex gap-1">
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => handleLoanDecision(r._id, "approved")}
                      disabled={updateLoanMutation.isPending}
                    >
                      <i className="bi bi-check-lg"></i> Approve
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleLoanDecision(r._id, "rejected")}
                      disabled={updateLoanMutation.isPending}
                    >
                      <i className="bi bi-x-lg"></i> Reject
                    </button>
                  </div>
                ),
              },
            ]}
            rows={pendingLoans}
            empty="No loans awaiting decision"
          />
        )}
      </div>

      <div className="fin-card">
        <h6 className="fw-bold mb-3">User management</h6>
        {isLoading ? (
          <div className="d-flex flex-column gap-2">
            <Skeleton h={40} />
            <Skeleton h={40} />
          </div>
        ) : (
          <DataTable
            columns={[
              { key: "name", label: "Name" },
              { key: "email", label: "Email" },
              {
                key: "role",
                label: "Role",
                render: (r) => <span className="fin-badge info">{r.role?.replace("_", " ")}</span>,
              },
              {
                key: "status",
                label: "Verified Status",
                type: "status",
                render: (r) => (r.isVerified ? "active" : "pending"),
              },
              {
                key: "action",
                label: "Action",
                render: (r) => (
                  <div className="d-flex gap-1 align-items-center">
                    <button className="btn btn-sm btn-link p-0 text-decoration-none">Manage</button>
                  </div>
                ),
              },
            ]}
            rows={users}
            empty="No users found in database"
          />
        )}
      </div>
    </DashboardLayout>
  );
}
