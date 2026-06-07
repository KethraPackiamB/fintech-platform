import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import DashboardLayout from "../layouts/DashboardLayout";
import DataTable from "../components/ui-fintech/DataTable";
import StatCard from "../components/ui-fintech/StatCard";
import Skeleton from "../components/ui-fintech/Skeleton";
import { inr } from "../utils/format";
import { useToast } from "../app/AppProviders";
import { roleAtom, userAtom } from "../store/atoms";
import { api } from "../api/axios";
import { endpoints } from "../api/endpoints";

export default function PaymentsPage() {
  const toast = useToast();
  const role = useAtomValue(roleAtom);
  const user = useAtomValue(userAtom);
  const isAdmin = ["admin", "super_admin", "loan_officer", "risk_analyst"].includes(role);

  const [selectedLoan, setSelectedLoan] = useState("");
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState("upi");
  const [error, setError] = useState("");

  // Query payments
  const { data: paymentsResponse, isLoading: isPaymentsLoading, refetch: refetchPayments } = useQuery({
    queryKey: ["paymentsHistory", role],
    queryFn: async () => {
      const endpoint = isAdmin ? endpoints.payments.adminList : endpoints.payments.history;
      const response = await api.get(endpoint);
      return response.data.data || [];
    },
  });

  // Query loans (to populate payment drop-down)
  const { data: loansResponse, isLoading: isLoansLoading } = useQuery({
    queryKey: ["paymentsLoans", role],
    queryFn: async () => {
      const response = await api.get(endpoints.loans.list);
      return response.data.data || [];
    },
    enabled: !isAdmin, // Only customers select their own loans to make a payment
  });

  const payments = paymentsResponse || [];
  const loans = loansResponse || [];
  const activeLoans = loans.filter((l) => l.status === "disbursed" || l.status === "approved");

  const payMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await api.post(endpoints.payments.pay, payload);
      return response.data;
    },
    onSuccess: () => {
      toast("Payment completed successfully!", "success");
      setPayAmount("");
      setSelectedLoan("");
      refetchPayments();
    },
    onError: (err) => {
      setError(err?.response?.data?.message || err?.message || "Payment failed");
    },
  });

  // Calculate stats
  const paidThisYear = payments.filter((p) => p.status === "success").reduce((s, p) => s + p.amount, 0);
  const totalMonthlyEmiOutstanding = activeLoans.reduce((s, l) => s + (l.emi || 0), 0);

  const handlePay = (e) => {
    e.preventDefault();
    setError("");

    if (!selectedLoan) {
      return setError("Please select a loan to pay for.");
    }
    if (!payAmount || Number(payAmount) <= 0) {
      return setError("Please enter a valid payment amount.");
    }

    payMutation.mutate({
      loan: selectedLoan,
      amount: Number(payAmount),
      type: "emi",
      paymentMethod: payMethod,
    });
  };

  const handleLoanChange = (e) => {
    const loanId = e.target.value;
    setSelectedLoan(loanId);
    const loan = activeLoans.find((l) => l._id === loanId);
    if (loan) {
      setPayAmount(loan.emi?.toString() || "");
    } else {
      setPayAmount("");
    }
  };

  const isLoading = isPaymentsLoading || (!isAdmin && isLoansLoading);

  return (
    <DashboardLayout>
      <h3 className="fw-bold mb-1">Payments</h3>
      <p className="text-fin-muted mb-4">EMI payments, invoices, and Razorpay-powered checkout.</p>

      {isLoading ? (
        <div className="row g-3 mb-4">
          <div className="col-12"><Skeleton h={150} /></div>
        </div>
      ) : (
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-6 col-xl-3">
            <StatCard
              icon="wallet2"
              label={isAdmin ? "Total System Collection" : "Monthly Outstanding"}
              value={inr(isAdmin ? paidThisYear : totalMonthlyEmiOutstanding)}
              tone="warning"
            />
          </div>
          <div className="col-12 col-sm-6 col-xl-3">
            <StatCard icon="calendar-event" label="Next EMI Due" value={activeLoans.length > 0 ? "15th of Month" : "N/A"} tone="info" />
          </div>
          <div className="col-12 col-sm-6 col-xl-3">
            <StatCard icon="cash" label={isAdmin ? "Completed Payments" : "Paid overall"} value={inr(paidThisYear)} tone="success" />
          </div>
          <div className="col-12 col-sm-6 col-xl-3">
            {!isAdmin ? (
              <div className="fin-card h-100 p-3 bg-light border-0">
                <div className="text-fin-muted small fw-semibold mb-2">Pay EMI</div>
                {error && <div className="alert alert-danger py-1 px-2 small mb-2">{error}</div>}
                <form onSubmit={handlePay}>
                  <div className="mb-2">
                    <select
                      className="form-select form-select-sm"
                      value={selectedLoan}
                      onChange={handleLoanChange}
                      required
                    >
                      <option value="">Select Active Loan</option>
                      {activeLoans.map((l) => (
                        <option key={l._id} value={l._id}>
                          LN-{l._id.slice(-4).toUpperCase()} (EMI: {inr(l.emi)})
                        </option>
                      ))}
                    </select>
                  </div>
                  {selectedLoan && (
                    <>
                      <div className="input-group input-group-sm mb-2">
                        <span className="input-group-text">₹</span>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Amount"
                          value={payAmount}
                          onChange={(e) => setPayAmount(e.target.value)}
                          required
                        />
                      </div>
                      <div className="mb-2">
                        <select
                          className="form-select form-select-sm"
                          value={payMethod}
                          onChange={(e) => setPayMethod(e.target.value)}
                        >
                          <option value="upi">UPI / GPay</option>
                          <option value="card">Debit/Credit Card</option>
                          <option value="netbanking">NetBanking</option>
                        </select>
                      </div>
                      <button
                        type="submit"
                        className="btn btn-sm fin-btn-primary w-100"
                        disabled={payMutation.isPending}
                      >
                        {payMutation.isPending && (
                          <span className="spinner-border spinner-border-sm me-1" />
                        )}
                        Pay Now
                      </button>
                    </>
                  )}
                </form>
              </div>
            ) : (
              <div className="fin-card h-100 text-center d-flex align-items-center justify-content-center bg-light border-0">
                <span className="small text-fin-muted">Logged in as Administrator (View Only)</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="fin-card">
        <h6 className="fw-bold mb-3">Payment history</h6>
        {isLoading ? (
          <div className="d-flex flex-column gap-2">
            <Skeleton h={40} />
            <Skeleton h={40} />
          </div>
        ) : (
          <DataTable
            columns={[
              { key: "id", label: "Payment ID", render: (r) => r.transactionId || r._id },
              {
                key: "loan",
                label: "Loan",
                render: (r) => {
                  const loanVal = typeof r.loan === "object" ? r.loan?._id : r.loan;
                  return loanVal ? `LN-${loanVal.slice(-4).toUpperCase()}` : "N/A";
                },
              },
              { key: "amount", label: "Amount", render: (r) => inr(r.amount) },
              { key: "method", label: "Method", render: (r) => r.paymentMethod?.toUpperCase() || "UPI" },
              { key: "date", label: "Date", render: (r) => r.paidAt ? new Date(r.paidAt).toLocaleDateString() : new Date(r.createdAt).toLocaleDateString() },
              { key: "status", label: "Status", type: "status" },
              {
                key: "action",
                label: "Invoice",
                render: () => (
                  <button className="btn btn-sm btn-link p-0" onClick={() => toast("Downloading invoice...", "info")}>
                    <i className="bi bi-download"></i>
                  </button>
                ),
              },
            ]}
            rows={payments}
            empty="No payment transactions recorded"
          />
        )}
      </div>
    </DashboardLayout>
  );
}
