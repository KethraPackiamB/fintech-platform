import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const TITLE_MAP = {
  "/": "FinCore — Smart FinTech Loan & Credit Platform",
  "/login": "Sign in · FinCore",
  "/register": "Create account · FinCore",
  "/forgot-password": "Reset password · FinCore",
  "/dashboard": "Dashboard · FinCore",
  "/analytics": "Analytics · FinCore",
  "/loans": "Loans · FinCore",
  "/loans/apply": "Apply for Loan · FinCore",
  "/emi-calculator": "EMI Calculator · FinCore",
  "/credit-score": "Credit Score · FinCore",
  "/kyc": "KYC Verification · FinCore",
  "/payments": "Payments · FinCore",
  "/fraud": "Fraud Detection · FinCore",
  "/admin": "Admin Panel · FinCore",
};

export default function DocumentTitleHandler() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = TITLE_MAP[pathname] || "FinCore";
    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) {
      if (pathname === "/") {
        descMeta.setAttribute(
          "content",
          "AI-powered loan origination, credit scoring, fraud detection, and payments."
        );
      } else {
        descMeta.setAttribute("content", "Lovable Generated Project");
      }
    }
  }, [pathname]);

  return null;
}
