import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import DashboardLayout from "../layouts/DashboardLayout";
import { useToast } from "../app/AppProviders";
import { api } from "../api/axios";
import { endpoints } from "../api/endpoints";
import Skeleton from "../components/ui-fintech/Skeleton";

export default function KycPage() {
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    aadhaar: "",
    pan: "",
    dob: "",
    address: "",
  });
  const [files, setFiles] = useState({
    aadhaarDoc: null,
    panDoc: null,
  });
  const [error, setError] = useState("");

  const { data: kyc, isLoading, refetch } = useQuery({
    queryKey: ["kycStatus"],
    queryFn: async () => {
      const response = await api.get(endpoints.kyc.status);
      return response.data.data;
    },
  });

  const submitKycMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await api.post(endpoints.kyc.submit, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      toast("KYC details submitted successfully", "success");
      setIsEditing(false);
      refetch();
    },
    onError: (err) => {
      setError(err?.response?.data?.message || err?.message || "Submission failed");
    },
  });

  const handleFileChange = (key) => (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) return toast("File too large (max 5MB)", "danger");
    setFiles((prev) => ({ ...prev, [key]: f }));
  };

  const handleInputChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!/^\d{12}$/.test(form.aadhaar)) {
      return setError("Aadhaar must be exactly 12 digits");
    }
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(form.pan)) {
      return setError("Invalid PAN format (e.g. ABCDE1234F)");
    }
    if (!form.dob) {
      return setError("Date of Birth is required");
    }
    if (form.address.trim().length < 10) {
      return setError("Please provide a complete residential address (min 10 characters)");
    }
    if (!files.aadhaarDoc) {
      return setError("Please upload your Aadhaar document");
    }
    if (!files.panDoc) {
      return setError("Please upload your PAN document");
    }

    const formData = new FormData();
    formData.append("aadhaar", form.aadhaar);
    formData.append("pan", form.pan);
    formData.append("dob", form.dob);
    formData.append("address", form.address);
    formData.append("aadhaarDoc", files.aadhaarDoc);
    formData.append("panDoc", files.panDoc);

    submitKycMutation.mutate(formData);
  };

  const hasKycSubmitted = kyc && kyc.status !== "not_submitted";

  return (
    <DashboardLayout>
      <h3 className="fw-bold mb-1">KYC Verification</h3>
      <p className="text-fin-muted mb-4">
        Securely upload your identity documents. End-to-end encrypted.
      </p>

      {isLoading ? (
        <div className="d-flex flex-column gap-3">
          <Skeleton h={40} />
          <Skeleton h={150} />
        </div>
      ) : hasKycSubmitted && !isEditing ? (
        <div className="fin-card">
          <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
            <h5 className="fw-bold mb-0 text-primary">Your KYC Status</h5>
            <span
              className={`fin-badge ${
                kyc.status === "verified"
                  ? "success"
                  : kyc.status === "rejected"
                    ? "danger"
                    : "warning"
              }`}
            >
              {kyc.status?.toUpperCase()}
            </span>
          </div>

          <div className="row g-3 small mb-4">
            <div className="col-sm-3 text-fin-muted">Aadhaar Card Number</div>
            <div className="col-sm-9 fw-semibold text-dark">XXXXXXXX{kyc.aadhaar?.slice(-4)}</div>
            <div className="col-sm-3 text-fin-muted">PAN Card Number</div>
            <div className="col-sm-9 text-dark">{kyc.pan}</div>
            <div className="col-sm-3 text-fin-muted">Date of Birth</div>
            <div className="col-sm-9 text-dark">
              {kyc.dob ? new Date(kyc.dob).toLocaleDateString() : "N/A"}
            </div>
            <div className="col-sm-3 text-fin-muted">Residential Address</div>
            <div className="col-sm-9 text-dark">{kyc.address}</div>
            {kyc.remarks && (
              <>
                <div className="col-sm-3 text-fin-muted">Remarks / Reason</div>
                <div className="col-sm-9 text-danger fw-semibold">{kyc.remarks}</div>
              </>
            )}
          </div>

          {kyc.status === "rejected" && (
            <button
              className="btn fin-btn-primary"
              onClick={() => {
                setForm({
                  aadhaar: kyc.aadhaar || "",
                  pan: kyc.pan || "",
                  dob: kyc.dob ? kyc.dob.slice(0, 10) : "",
                  address: kyc.address || "",
                });
                setIsEditing(true);
              }}
            >
              Re-submit KYC details
            </button>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="fin-card p-4">
            <h5 className="fw-bold mb-4 text-primary">Identity Details</h5>
            {error && <div className="alert alert-danger py-2 small">{error}</div>}

            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Aadhaar Number (12 digits)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 123456789012"
                  value={form.aadhaar}
                  onChange={handleInputChange("aadhaar")}
                  maxLength={12}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold">PAN Card Number</label>
                <input
                  type="text"
                  className="form-control text-uppercase"
                  placeholder="e.g. ABCDE1234F"
                  value={form.pan}
                  onChange={handleInputChange("pan")}
                  maxLength={10}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Date of Birth</label>
                <input
                  type="date"
                  className="form-control"
                  value={form.dob}
                  onChange={handleInputChange("dob")}
                  required
                />
              </div>
              <div className="col-12">
                <label className="form-label small fw-semibold">Residential Address</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Enter full flat, street, and pin code details"
                  value={form.address}
                  onChange={handleInputChange("address")}
                  required
                />
              </div>
            </div>

            <h5 className="fw-bold mb-4 text-primary">Upload Identity Documents</h5>
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <div className="p-3 border rounded-3 text-center bg-light-subtle h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div className="fs-3 text-primary mb-2">
                      <i className="bi bi-card-text"></i>
                    </div>
                    <h6 className="fw-bold mb-1 small">Aadhaar Card</h6>
                    <p className="text-fin-muted mb-3" style={{ fontSize: "0.75rem" }}>
                      PDF scan or front/back photograph (max 5MB)
                    </p>
                  </div>
                  <div>
                    <input
                      type="file"
                      id="aadhaarDoc"
                      className="form-control form-control-sm"
                      accept="image/*,.pdf"
                      onChange={handleFileChange("aadhaarDoc")}
                      required
                    />
                    {files.aadhaarDoc && (
                      <div className="text-success text-truncate mt-2 small">
                        <i className="bi bi-check-circle-fill me-1"></i>
                        {files.aadhaarDoc.name}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="p-3 border rounded-3 text-center bg-light-subtle h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div className="fs-3 text-primary mb-2">
                      <i className="bi bi-person-vcard"></i>
                    </div>
                    <h6 className="fw-bold mb-1 small">PAN Card</h6>
                    <p className="text-fin-muted mb-3" style={{ fontSize: "0.75rem" }}>
                      Readable PDF or high quality image (max 5MB)
                    </p>
                  </div>
                  <div>
                    <input
                      type="file"
                      id="panDoc"
                      className="form-control form-control-sm"
                      accept="image/*,.pdf"
                      onChange={handleFileChange("panDoc")}
                      required
                    />
                    {files.panDoc && (
                      <div className="text-success text-truncate mt-2 small">
                        <i className="bi bi-check-circle-fill me-1"></i>
                        {files.panDoc.name}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex gap-2">
              <button
                type="submit"
                className="btn fin-btn-primary"
                disabled={submitKycMutation.isPending}
              >
                {submitKycMutation.isPending && (
                  <span className="spinner-border spinner-border-sm me-2" />
                )}
                Submit Verification
              </button>
              {isEditing && (
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>
      )}
    </DashboardLayout>
  );
}
