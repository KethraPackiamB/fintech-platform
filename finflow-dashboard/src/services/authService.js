import { api } from "../api/axios";
import { endpoints } from "../api/endpoints";

export const authService = {
  login: (payload) => api.post(endpoints.auth.login, payload).then((r) => r.data),
  register: (payload) => api.post(endpoints.auth.register, payload).then((r) => r.data),
  me: () => api.get(endpoints.auth.me).then((r) => r.data),
  forgot: (email) => api.post(endpoints.auth.forgot, { email }).then((r) => r.data),
  reset: (payload) => api.post(endpoints.auth.reset, payload).then((r) => r.data),
  refresh: () => api.post(endpoints.auth.refresh).then((r) => r.data),
};
