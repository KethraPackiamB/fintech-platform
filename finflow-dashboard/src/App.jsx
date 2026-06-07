import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppProviders from "./app/AppProviders.jsx";
import DocumentTitleHandler from "./components/DocumentTitleHandler.jsx";

// Import pages
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import AnalyticsPage from "./pages/AnalyticsPage.jsx";
import LoansPage from "./pages/LoansPage.jsx";
import LoanApplyPage from "./pages/LoanApplyPage.jsx";
import EmiCalculatorPage from "./pages/EmiCalculatorPage.jsx";
import CreditScorePage from "./pages/CreditScorePage.jsx";
import KycPage from "./pages/KycPage.jsx";
import PaymentsPage from "./pages/PaymentsPage.jsx";
import FraudPage from "./pages/FraudPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";

// Protected Route Guard
import ProtectedRoute from "./guards/ProtectedRoute.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProviders>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <DocumentTitleHandler />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute roles={["loan_officer", "risk_analyst", "admin", "super_admin"]}>
                  <AnalyticsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/loans"
              element={
                <ProtectedRoute>
                  <LoansPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/loans/apply"
              element={
                <ProtectedRoute roles={["customer", "loan_officer", "admin", "super_admin"]}>
                  <LoanApplyPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/emi-calculator"
              element={
                <ProtectedRoute>
                  <EmiCalculatorPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/credit-score"
              element={
                <ProtectedRoute>
                  <CreditScorePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/kyc"
              element={
                <ProtectedRoute>
                  <KycPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payments"
              element={
                <ProtectedRoute roles={["customer", "admin", "super_admin"]}>
                  <PaymentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/fraud"
              element={
                <ProtectedRoute roles={["risk_analyst", "admin", "super_admin"]}>
                  <FraudPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={["admin", "super_admin"]}>
                  <AdminPage />
                </ProtectedRoute>
              }
            />

            {/* Fallback (404/redirect) */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AppProviders>
    </QueryClientProvider>
  );
}
