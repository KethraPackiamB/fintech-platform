import { useQuery, useMutation } from "@tanstack/react-query";
import DashboardLayout from "../layouts/DashboardLayout";
import DataTable from "../components/ui-fintech/DataTable";
import StatCard from "../components/ui-fintech/StatCard";
import Skeleton from "../components/ui-fintech/Skeleton";
import { useToast } from "../app/AppProviders";
import { api } from "../api/axios";
import { endpoints } from "../api/endpoints";

export default function FraudPage() {
  const toast = useToast();

  const { data: alertsResponse, isLoading, refetch } = useQuery({
    queryKey: ["fraudAlertsList"],
    queryFn: async () => {
      const response = await api.get(endpoints.fraud.list);
      return response.data.data || [];
    },
  });

  const resolveMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const response = await api.patch(endpoints.fraud.resolve(id), { status });
      return response.data;
    },
    onSuccess: (_, variables) => {
      toast(`Alert marked as ${variables.status.replace("_", " ")}`, "success");
      refetch();
    },
    onError: (err) => {
      toast(err?.response?.data?.message || err?.message || "Action failed", "danger");
    },
  });

  const alerts = alertsResponse || [];

  // Active alerts stats
  const activeAlerts = alerts.filter((a) => a.status === "open" || a.status === "investigating");
  const highRisk = activeAlerts.filter((a) => a.severity === "high" || a.severity === "critical").length;
  const mediumRisk = activeAlerts.filter((a) => a.severity === "medium").length;
  const lowRisk = activeAlerts.filter((a) => a.severity === "low").length;
  const resolvedCount = alerts.filter((a) => a.status === "resolved").length;

  const handleResolve = (id, status) => {
    resolveMutation.mutate({ id, status });
  };

  return (
    <DashboardLayout>
      <h3 className="fw-bold mb-1">Fraud Detection</h3>
      <p className="text-fin-muted mb-4">Real-time anomaly detection across user activity.</p>

      {isLoading ? (
        <div className="d-flex flex-column gap-3 mb-4">
          <Skeleton h={100} />
        </div>
      ) : (
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-6 col-xl-3">
            <StatCard icon="shield-exclamation" label="High/Crit alerts" value={highRisk.toString()} tone="danger" />
          </div>
          <div className="col-12 col-sm-6 col-xl-3">
            <StatCard icon="exclamation-triangle" label="Medium risk" value={mediumRisk.toString()} tone="warning" />
          </div>
          <div className="col-12 col-sm-6 col-xl-3">
            <StatCard icon="info-circle" label="Low risk" value={lowRisk.toString()} tone="info" />
          </div>
          <div className="col-12 col-sm-6 col-xl-3">
            <StatCard icon="check2-circle" label="Resolved alerts" value={resolvedCount.toString()} tone="success" />
          </div>
        </div>
      )}

      <div className="fin-card">
        <h6 className="fw-bold mb-3">Suspicious activity</h6>
        {isLoading ? (
          <div className="d-flex flex-column gap-2">
            <Skeleton h={48} />
            <Skeleton h={48} />
          </div>
        ) : (
          <DataTable
            columns={[
              { key: "id", label: "Alert ID", render: (r) => `FR-${r._id.slice(-4).toUpperCase()}` },
              {
                key: "user",
                label: "User",
                render: (r) => (typeof r.user === "object" ? `${r.user.name} (${r.user.email})` : r.user || "Unknown"),
              },
              { key: "reason", label: "Reason", render: (r) => r.description || r.type?.replace("_", " ") },
              { key: "risk", label: "Severity", type: "status", render: (r) => r.severity },
              { key: "status", label: "Status", type: "status" },
              { key: "time", label: "Detected", render: (r) => new Date(r.createdAt).toLocaleString() },
              {
                key: "action",
                label: "Action",
                render: (r) => (
                  <div className="d-flex gap-1">
                    {r.status !== "resolved" && r.status !== "false_positive" ? (
                      <>
                        <button
                          className="btn btn-sm btn-outline-success"
                          title="Mark Resolved"
                          onClick={() => handleResolve(r._id, "resolved")}
                          disabled={resolveMutation.isPending}
                        >
                          <i className="bi bi-check"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          title="Mark False Positive"
                          onClick={() => handleResolve(r._id, "false_positive")}
                          disabled={resolveMutation.isPending}
                        >
                          <i className="bi bi-x"></i>
                        </button>
                      </>
                    ) : (
                      <span className="small text-fin-muted">No action needed</span>
                    )}
                  </div>
                ),
              },
            ]}
            rows={alerts}
            empty="No fraud alerts flagged by system"
          />
        )}
      </div>
    </DashboardLayout>
  );
}
