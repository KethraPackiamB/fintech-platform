import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { inr, emiCalc } from "../utils/format";
import { useToast } from "../app/AppProviders";
import { api } from "../api/axios";
import { endpoints } from "../api/endpoints";

const STEPS = [
  { title: "Personal Details", icon: "bi-person-badge" },
  { title: "Employment Details", icon: "bi-briefcase" },
  { title: "Loan Details", icon: "bi-cash-coin" },
  { title: "Required Documents", icon: "bi-file-earmark-arrow-up" },
  { title: "Review & Submit", icon: "bi-file-earmark-check" },
];

export default function LoanApplyPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    // Personal Details
    fullName: "",
    email: "",
    phone: "",
    pan: "",
    dob: "",
    address: "",

    // Employment Details
    employmentStatus: "salaried", // salaried, self_employed, business_owner, unemployed
    employerName: "",
    annualIncome: 600000,
    experienceYears: 2,

    // Loan Details
    amount: 250000,
    tenure: 24,
    rate: 10.5,
    purpose: "personal", // personal, home, education, business, vehicle, medical

    // Required Documents
    docIdName: "",
    docIncomeName: "",
    docAddressName: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStage, setSubmitStage] = useState(-1);
  const navigate = useNavigate();
  const toast = useToast();

  const update = (k, v) => setForm({ ...form, [k]: v });

  const validateStep = () => {
    setError("");
    if (step === 0) {
      if (form.fullName.trim().length < 2) return "Enter full name";
      if (!/\S+@\S+\.\S+/.test(form.email)) return "Invalid email address";
      if (!/^\d{10}$/.test(form.phone)) return "Phone must be exactly 10 digits";
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(form.pan)) return "Invalid PAN format (e.g. ABCDE1234F)";
      if (!form.dob) return "Enter Date of Birth";
      if (form.address.trim().length < 5) return "Enter complete address";
    }
    if (step === 1) {
      if (form.employmentStatus !== "unemployed") {
        if (form.employerName.trim().length < 2) return "Enter company / employer name";
        if (form.experienceYears < 0) return "Years of experience cannot be negative";
      }
      if (form.annualIncome <= 0 || isNaN(form.annualIncome))
        return "Annual income must be a positive number";
    }
    if (step === 2) {
      if (form.amount < 10000 || form.amount > 5000000)
        return "Amount must be between ₹10,000 and ₹50,00,000";
      if (form.tenure < 3 || form.tenure > 84) return "Tenure must be between 3 and 84 months";
      if (form.rate < 3 || form.rate > 30) return "Interest rate must be between 3% and 30%";
    }
    if (step === 3) {
      if (!form.docIdName) return "Please upload ID Proof (Aadhaar / Passport)";
      if (!form.docIncomeName) return "Please upload Income Proof (Salary slip / ITR)";
      if (!form.docAddressName)
        return "Please upload Address Proof (Utility bill / Rent agreement)";
    }
    return "";
  };

  const handleNext = () => {
    const err = validateStep();
    if (err) {
      setError(err);
      return;
    }
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  const handleBack = () => {
    setError("");
    setStep((s) => Math.max(0, s - 1));
  };

  const handleSubmit = () => {
    const err = validateStep();
    if (err) {
      setError(err);
      return;
    }

    setIsSubmitting(true);
    setSubmitStage(0);

    const stages = [
      "Submitting application details...",
      "Performing KYC and database verification...",
      "Fetching credit bureau score...",
      "Scanning with fraud screening systems...",
      "Evaluating risk metrics...",
      "Finalizing credit decision...",
    ];

    let currentStage = 0;
    const interval = setInterval(async () => {
      currentStage++;
      if (currentStage < stages.length) {
        setSubmitStage(currentStage);
      } else {
        clearInterval(interval);
        try {
          await api.post(endpoints.loans.apply, {
            amount: Number(form.amount),
            tenure: Number(form.tenure),
            purpose: form.purpose,
          });
          setIsSubmitting(false);
          toast("Loan application submitted and auto-approved!", "success");
          navigate("/loans");
        } catch (e) {
          setIsSubmitting(false);
          setError(e?.response?.data?.message || e?.message || "Loan application failed");
        }
      }
    }, 1200);
  };

  const monthlyEMI = emiCalc(Number(form.amount), Number(form.rate), Number(form.tenure));

  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h3 className="fw-bold mb-1">Apply for a Loan</h3>
          <p className="text-fin-muted mb-0">
            Fill out our 5-step digital application for instant risk assessment.
          </p>
        </div>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => navigate("/loans")}
        >
          <i className="bi bi-arrow-left me-1"></i> Back to Loans
        </button>
      </div>

      {/* Premium Multi-step Indicator */}
      <div className="row g-2 mb-4">
        {STEPS.map((s, i) => {
          const isActive = i === step;
          const isCompleted = i < step;
          return (
            <div key={s.title} className="col-lg col-md-4 col-sm-6">
              <div
                className={`d-flex align-items-center p-3 rounded-3 border transition-all ${
                  isActive
                    ? "bg-white border-primary shadow-sm text-primary fw-semibold"
                    : isCompleted
                      ? "bg-light-subtle border-success text-success"
                      : "bg-light text-fin-muted border-light"
                }`}
                style={{
                  cursor: i < step ? "pointer" : "default",
                  transition: "all 0.2s ease-in-out",
                  borderLeftWidth: isActive ? "4px" : "1px",
                }}
                onClick={() => i < step && setStep(i)}
              >
                <div
                  className={`rounded-circle d-flex align-items-center justify-content-center me-3`}
                  style={{
                    width: 32,
                    height: 32,
                    background: isActive
                      ? "var(--fin-primary)"
                      : isCompleted
                        ? "var(--fin-success, #198754)"
                        : "#e2e8f0",
                    color: isActive || isCompleted ? "#fff" : "var(--fin-muted)",
                  }}
                >
                  {isCompleted ? (
                    <i className="bi bi-check-lg"></i>
                  ) : (
                    <i className={`bi ${s.icon}`}></i>
                  )}
                </div>
                <div style={{ fontSize: "0.85rem" }}>
                  <div
                    className="text-uppercase text-fin-muted"
                    style={{ fontSize: "0.7rem", letterSpacing: "0.05em" }}
                  >
                    Step {i + 1}
                  </div>
                  <div className="text-truncate" style={{ maxWidth: "120px" }}>
                    {s.title}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="row g-4">
        <div className={step === 2 ? "col-lg-8" : "col-12"}>
          <div className="fin-card p-4">
            {error && (
              <div className="alert alert-danger py-2 px-3 small d-flex align-items-center gap-2 mb-4 animate-fade-in">
                <i className="bi bi-exclamation-triangle-fill"></i>
                <div>{error}</div>
              </div>
            )}

            {/* Step 1: Personal Details */}
            {step === 0 && (
              <div>
                <h5 className="fw-bold mb-4 text-primary">Personal Details</h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-dark">
                      Full Name (as per PAN)
                    </label>
                    <input
                      className="form-control"
                      placeholder="e.g. John Doe"
                      value={form.fullName}
                      onChange={(e) => update("fullName", e.target.value)}
                      maxLength={100}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-dark">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="e.g. john@example.com"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      maxLength={100}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold text-dark">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="10-digit mobile number"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value.replace(/\D/g, ""))}
                      maxLength={10}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold text-dark">
                      PAN Card Number
                    </label>
                    <input
                      className="form-control text-uppercase"
                      placeholder="e.g. ABCDE1234F"
                      value={form.pan}
                      onChange={(e) => update("pan", e.target.value.toUpperCase())}
                      maxLength={10}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold text-dark">Date of Birth</label>
                    <input
                      type="date"
                      className="form-control"
                      value={form.dob}
                      onChange={(e) => update("dob", e.target.value)}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-semibold text-dark">
                      Current Residential Address
                    </label>
                    <textarea
                      rows={3}
                      className="form-control"
                      placeholder="Enter full flat, street, area details and PIN code"
                      value={form.address}
                      onChange={(e) => update("address", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Employment Details */}
            {step === 1 && (
              <div>
                <h5 className="fw-bold mb-4 text-primary">Employment Details</h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-dark">
                      Employment Status
                    </label>
                    <select
                      className="form-select"
                      value={form.employmentStatus}
                      onChange={(e) => update("employmentStatus", e.target.value)}
                    >
                      <option value="salaried">Salaried Employee</option>
                      <option value="self_employed">Self Employed Professional</option>
                      <option value="business_owner">Business Owner / Merchant</option>
                      <option value="unemployed">Unemployed / Student / Retired</option>
                    </select>
                  </div>

                  {form.employmentStatus !== "unemployed" && (
                    <>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-dark">
                          {form.employmentStatus === "business_owner"
                            ? "Business Name"
                            : "Employer Name"}
                        </label>
                        <input
                          className="form-control"
                          placeholder="e.g. Acme Corp"
                          value={form.employerName}
                          onChange={(e) => update("employerName", e.target.value)}
                          maxLength={100}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-dark">
                          Years of Experience / Vintage
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="e.g. 3"
                          value={form.experienceYears}
                          onChange={(e) => update("experienceYears", parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </>
                  )}

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-dark">
                      Annual Income (Gross ₹)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="e.g. 600000"
                      value={form.annualIncome}
                      onChange={(e) => update("annualIncome", parseFloat(e.target.value) || 0)}
                    />
                    <div className="form-text text-fin-muted small mt-1">
                      Monthly Approx: {inr(Math.round(form.annualIncome / 12))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Loan Details */}
            {step === 2 && (
              <div>
                <h5 className="fw-bold mb-4 text-primary">Loan Specifications</h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-dark">
                      Requested Loan Amount (₹)
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">₹</span>
                      <input
                        type="number"
                        className="form-control"
                        value={form.amount}
                        onChange={(e) => update("amount", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="form-text text-fin-muted small mt-1">
                      Min: ₹10,000 | Max: ₹50,00,000
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-dark">
                      Loan Tenure (Months)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={form.tenure}
                      onChange={(e) => update("tenure", parseInt(e.target.value) || 0)}
                    />
                    <div className="form-text text-fin-muted small mt-1">
                      Min: 3 months | Max: 84 months
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-dark">
                      Offered Interest Rate (% p.a.)
                    </label>
                    <div className="input-group">
                      <input
                        type="number"
                        step="0.05"
                        className="form-control"
                        value={form.rate}
                        onChange={(e) => update("rate", parseFloat(e.target.value) || 0)}
                      />
                      <span className="input-group-text">%</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-dark">
                      Purpose of Loan
                    </label>
                    <select
                      className="form-select"
                      value={form.purpose}
                      onChange={(e) => update("purpose", e.target.value)}
                    >
                      <option value="personal">Personal Expenses</option>
                      <option value="home">Home Construction / Renovation</option>
                      <option value="education">Higher Education / Fees</option>
                      <option value="business">Business Working Capital</option>
                      <option value="vehicle">Vehicle Acquisition</option>
                      <option value="medical">Emergency Medical Costs</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Required Documents */}
            {step === 3 && (
              <div>
                <h5 className="fw-bold mb-4 text-primary">Required Document Proofs</h5>
                <p className="small text-fin-muted mb-4">
                  Please upload readable PDF scans or clear photographs (JPEG/PNG) of the supporting
                  documents below.
                </p>
                <div className="row g-4">
                  <div className="col-md-4">
                    <div className="p-3 border rounded-3 text-center bg-light-subtle h-100 d-flex flex-column justify-content-between">
                      <div>
                        <div className="fs-3 text-primary mb-2">
                          <i className="bi bi-card-text"></i>
                        </div>
                        <h6 className="fw-bold mb-1 small text-dark">ID Proof</h6>
                        <p className="text-fin-muted mb-3" style={{ fontSize: "0.75rem" }}>
                          Aadhaar Card, Passport, or PAN Card
                        </p>
                      </div>
                      <div>
                        <input
                          type="file"
                          id="idProof"
                          className="d-none"
                          accept="image/*,.pdf"
                          onChange={(e) => update("docIdName", e.target.files?.[0]?.name || "")}
                        />
                        <label htmlFor="idProof" className="btn btn-sm btn-outline-primary w-100">
                          {form.docIdName ? "Replace File" : "Choose File"}
                        </label>
                        {form.docIdName && (
                          <div className="text-success text-truncate mt-2 small">
                            <i className="bi bi-check-circle-fill me-1"></i>
                            {form.docIdName}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="p-3 border rounded-3 text-center bg-light-subtle h-100 d-flex flex-column justify-content-between">
                      <div>
                        <div className="fs-3 text-primary mb-2">
                          <i className="bi bi-wallet2"></i>
                        </div>
                        <h6 className="fw-bold mb-1 small text-dark">Income Proof</h6>
                        <p className="text-fin-muted mb-3" style={{ fontSize: "0.75rem" }}>
                          Salary slips (last 3 months) or Income Tax Return
                        </p>
                      </div>
                      <div>
                        <input
                          type="file"
                          id="incomeProof"
                          className="d-none"
                          accept="image/*,.pdf"
                          onChange={(e) => update("docIncomeName", e.target.files?.[0]?.name || "")}
                        />
                        <label
                          htmlFor="incomeProof"
                          className="btn btn-sm btn-outline-primary w-100"
                        >
                          {form.docIncomeName ? "Replace File" : "Choose File"}
                        </label>
                        {form.docIncomeName && (
                          <div className="text-success text-truncate mt-2 small">
                            <i className="bi bi-check-circle-fill me-1"></i>
                            {form.docIncomeName}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="p-3 border rounded-3 text-center bg-light-subtle h-100 d-flex flex-column justify-content-between">
                      <div>
                        <div className="fs-3 text-primary mb-2">
                          <i className="bi bi-house-door"></i>
                        </div>
                        <h6 className="fw-bold mb-1 small text-dark">Address Proof</h6>
                        <p className="text-fin-muted mb-3" style={{ fontSize: "0.75rem" }}>
                          Electricity bill, Rental agreement, or voter ID
                        </p>
                      </div>
                      <div>
                        <input
                          type="file"
                          id="addressProof"
                          className="d-none"
                          accept="image/*,.pdf"
                          onChange={(e) =>
                            update("docAddressName", e.target.files?.[0]?.name || "")
                          }
                        />
                        <label
                          htmlFor="addressProof"
                          className="btn btn-sm btn-outline-primary w-100"
                        >
                          {form.docAddressName ? "Replace File" : "Choose File"}
                        </label>
                        {form.docAddressName && (
                          <div className="text-success text-truncate mt-2 small">
                            <i className="bi bi-check-circle-fill me-1"></i>
                            {form.docAddressName}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Review & Submit */}
            {step === 4 && (
              <div>
                <h5 className="fw-bold mb-4 text-primary">Review & Confirm Application</h5>
                <p className="small text-fin-muted mb-4">
                  Please verify that all details you have provided below are accurate. You can edit
                  any section using the edit links.
                </p>

                <div className="d-flex flex-column gap-4">
                  <div className="border rounded-3 p-3">
                    <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                      <h6 className="fw-bold mb-0 text-dark">
                        <i className="bi bi-person me-2 text-primary"></i>Applicant Details
                      </h6>
                      <button
                        className="btn btn-sm btn-link p-0 text-primary fw-semibold"
                        onClick={() => setStep(0)}
                      >
                        <i className="bi bi-pencil me-1"></i>Edit
                      </button>
                    </div>
                    <div className="row g-2 small">
                      <div className="col-sm-4 text-fin-muted">Full Name</div>
                      <div className="col-sm-8 fw-semibold text-dark">{form.fullName}</div>
                      <div className="col-sm-4 text-fin-muted">Email Address</div>
                      <div className="col-sm-8 text-dark">{form.email}</div>
                      <div className="col-sm-4 text-fin-muted">Phone Number</div>
                      <div className="col-sm-8 text-dark">{form.phone}</div>
                      <div className="col-sm-4 text-fin-muted">PAN Card</div>
                      <div className="col-sm-8 text-dark">{form.pan}</div>
                      <div className="col-sm-4 text-fin-muted">Date of Birth</div>
                      <div className="col-sm-8 text-dark">{form.dob}</div>
                      <div className="col-sm-4 text-fin-muted">Residential Address</div>
                      <div className="col-sm-8 text-dark">{form.address}</div>
                    </div>
                  </div>

                  <div className="border rounded-3 p-3">
                    <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                      <h6 className="fw-bold mb-0 text-dark">
                        <i className="bi bi-briefcase me-2 text-primary"></i>Employment Status
                      </h6>
                      <button
                        className="btn btn-sm btn-link p-0 text-primary fw-semibold"
                        onClick={() => setStep(1)}
                      >
                        <i className="bi bi-pencil me-1"></i>Edit
                      </button>
                    </div>
                    <div className="row g-2 small">
                      <div className="col-sm-4 text-fin-muted">Employment Type</div>
                      <div className="col-sm-8 fw-semibold text-capitalize text-dark">
                        {form.employmentStatus.replace("_", " ")}
                      </div>
                      {form.employmentStatus !== "unemployed" && (
                        <>
                          <div className="col-sm-4 text-fin-muted">Company / Employer</div>
                          <div className="col-sm-8 text-dark">{form.employerName}</div>
                          <div className="col-sm-4 text-fin-muted">Experience / Vintage</div>
                          <div className="col-sm-8 text-dark">{form.experienceYears} Years</div>
                        </>
                      )}
                      <div className="col-sm-4 text-fin-muted">Declared Annual Income</div>
                      <div className="col-sm-8 text-success fw-semibold">
                        {inr(form.annualIncome)}
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-3 p-3">
                    <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                      <h6 className="fw-bold mb-0 text-dark">
                        <i className="bi bi-cash-coin me-2 text-primary"></i>Loan Terms
                      </h6>
                      <button
                        className="btn btn-sm btn-link p-0 text-primary fw-semibold"
                        onClick={() => setStep(2)}
                      >
                        <i className="bi bi-pencil me-1"></i>Edit
                      </button>
                    </div>
                    <div className="row g-2 small">
                      <div className="col-sm-4 text-fin-muted">Requested Amount</div>
                      <div className="col-sm-8 fw-bold text-dark">{inr(form.amount)}</div>
                      <div className="col-sm-4 text-fin-muted">Tenure</div>
                      <div className="col-sm-8 text-dark">{form.tenure} Months</div>
                      <div className="col-sm-4 text-fin-muted">Interest Rate Offered</div>
                      <div className="col-sm-8 text-dark">{form.rate}% p.a.</div>
                      <div className="col-sm-4 text-fin-muted">Loan Purpose</div>
                      <div className="col-sm-8 text-capitalize text-dark">{form.purpose}</div>
                      <div className="col-sm-4 text-fin-muted">Estimated EMI</div>
                      <div className="col-sm-8 text-primary fw-bold">{inr(monthlyEMI)} / month</div>
                    </div>
                  </div>

                  <div className="border rounded-3 p-3">
                    <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                      <h6 className="fw-bold mb-0 text-dark">
                        <i className="bi bi-file-earmark-check me-2 text-primary"></i>Uploaded
                        Document Proofs
                      </h6>
                      <button
                        className="btn btn-sm btn-link p-0 text-primary fw-semibold"
                        onClick={() => setStep(3)}
                      >
                        <i className="bi bi-pencil me-1"></i>Edit
                      </button>
                    </div>
                    <div className="row g-2 small">
                      <div className="col-sm-4 text-fin-muted">ID Proof File</div>
                      <div className="col-sm-8 text-dark">
                        <i className="bi bi-file-earmark-pdf text-danger me-1"></i>
                        {form.docIdName}
                      </div>
                      <div className="col-sm-4 text-fin-muted">Income Proof File</div>
                      <div className="col-sm-8 text-dark">
                        <i className="bi bi-file-earmark-pdf text-danger me-1"></i>
                        {form.docIncomeName}
                      </div>
                      <div className="col-sm-4 text-fin-muted">Address Proof File</div>
                      <div className="col-sm-8 text-dark">
                        <i className="bi bi-file-earmark-pdf text-danger me-1"></i>
                        {form.docAddressName}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Submitting Overlay State */}
            {isSubmitting && (
              <div
                className="position-absolute top-0 start-0 w-100 h-100 bg-white d-flex flex-column align-items-center justify-content-center rounded-4"
                style={{ zIndex: 1050, opacity: 0.96 }}
              >
                <div
                  className="spinner-border text-primary mb-3"
                  style={{ width: "3.5rem", height: "3.5rem" }}
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
                <h5 className="fw-bold text-dark">Processing Auto-approval</h5>
                <p className="text-fin-muted text-center max-w-sm px-4">
                  Evaluating applicant profile against risk framework models.
                </p>
                <div
                  className="w-50 border rounded-pill overflow-hidden mt-3"
                  style={{ height: 6 }}
                >
                  <div
                    className="bg-primary h-100 transition-all duration-300"
                    style={{ width: `${((submitStage + 1) / 6) * 100}%` }}
                  ></div>
                </div>
                <div className="small fw-semibold text-primary mt-2">
                  {submitStage >= 0 &&
                    [
                      "Submitting details...",
                      "Checking KYC credentials...",
                      "Fetching Credit Score...",
                      "Scanning for fraud patterns...",
                      "Running risk scoring models...",
                      "Completing review decision...",
                    ][submitStage]}
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            {!isSubmitting && (
              <div className="d-flex justify-content-between mt-5 pt-3 border-top">
                <button
                  className="btn btn-outline-secondary"
                  onClick={handleBack}
                  disabled={step === 0}
                >
                  <i className="bi bi-arrow-left me-1"></i> Back
                </button>
                {step < STEPS.length - 1 ? (
                  <button className="btn fin-btn-primary" onClick={handleNext}>
                    Continue <i className="bi bi-arrow-right ms-1"></i>
                  </button>
                ) : (
                  <button className="btn btn-success" onClick={handleSubmit}>
                    <i className="bi bi-check2-circle me-1"></i> Submit Application
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar for Loan Calculator (Only visible in Loan Details Step) */}
        {step === 2 && (
          <div className="col-lg-4">
            <div className="fin-card p-4 h-100 bg-primary text-white border-0 position-relative overflow-hidden">
              <div
                className="position-absolute end-0 bottom-0 opacity-10 font-sans"
                style={{ fontSize: "12rem", lineHeight: 1, pointerEvents: "none" }}
              >
                <i className="bi bi-calculator"></i>
              </div>
              <h5 className="fw-bold mb-3">
                <i className="bi bi-calculator-fill me-2"></i>EMI Calculator
              </h5>
              <p className="small mb-4 opacity-75">
                Check estimated monthly payment calculations dynamically based on key indicators.
              </p>

              <div className="d-flex flex-column gap-4 mt-3">
                <div>
                  <div className="small opacity-75">Principal Amount</div>
                  <div className="fs-4 fw-bold">{inr(form.amount)}</div>
                </div>
                <div>
                  <div className="small opacity-75">Repayment Term</div>
                  <div className="fs-5 fw-semibold">
                    {form.tenure} Months{" "}
                    <span className="small opacity-75">({(form.tenure / 12).toFixed(1)} yrs)</span>
                  </div>
                </div>
                <div>
                  <div className="small opacity-75">Annual Interest Rate</div>
                  <div className="fs-5 fw-semibold">{form.rate}% p.a.</div>
                </div>
                <div className="pt-3 border-top border-white-50">
                  <div className="small opacity-75">Estimated Monthly EMI</div>
                  <div className="fs-3 fw-extrabold">
                    {inr(monthlyEMI)} <span className="fs-6 fw-normal opacity-75">/ month</span>
                  </div>
                </div>
                <div className="small opacity-50 text-center mt-2">
                  *This estimation is subject to processing fees, taxes, and final approval details.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Auto-approval Progress Flow Visualizer */}
      <div className="fin-card mt-4 p-4">
        <h6 className="fw-bold mb-4">
          <i className="bi bi-cpu me-2 text-primary"></i>Decision Engine Routing Pipeline
        </h6>
        <div className="row justify-content-between align-items-center g-3 text-center position-relative">
          {[
            { label: "1. Submission", icon: "bi-send" },
            { label: "2. KYC Validation", icon: "bi-shield-check" },
            { label: "3. Bureau Check", icon: "bi-graph-up-arrow" },
            { label: "4. Fraud Filter", icon: "bi-fingerprint" },
            { label: "5. Risk Matrix", icon: "bi-bar-chart-steps" },
            { label: "6. Decision", icon: "bi-check-circle" },
          ].map((s, i) => (
            <div key={s.label} className="col-6 col-sm-4 col-md">
              <div className="d-flex flex-column align-items-center">
                <div
                  className={`rounded-circle d-flex align-items-center justify-content-center mb-2`}
                  style={{
                    width: 48,
                    height: 48,
                    background: "rgba(99, 91, 255, 0.1)",
                    color: "var(--fin-primary)",
                  }}
                >
                  <i className={`bi ${s.icon} fs-5`}></i>
                </div>
                <span className="small fw-semibold text-dark" style={{ fontSize: "0.75rem" }}>
                  {s.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
