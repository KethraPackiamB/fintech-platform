export const endpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    refresh: "/auth/logout", // Dummy mapping since logout is post
    me: "/auth/me",
    forgot: "/auth/forgot-password",
    reset: "/auth/reset-password",
  },
  users: { list: "/admin/users", byId: (id) => `/admin/users/${id}` },
  loans: {
    list: "/loans",
    adminList: "/admin/loans",
    apply: "/loans",
    byId: (id) => `/loans/${id}`,
    updateStatus: (id) => `/admin/loans/${id}/status`,
  },
  payments: {
    history: "/payments",
    adminList: "/admin/payments",
    pay: "/payments",
  },
  creditScore: { me: "/credit-score" },
  fraud: { list: "/fraud", resolve: (id) => `/fraud/${id}` },
  analytics: { overview: "/analytics/dashboard", loans: "/analytics/loans" },
  kyc: { submit: "/kyc", status: "/kyc", verify: (userId) => `/admin/kyc/${userId}/verify` },
};
