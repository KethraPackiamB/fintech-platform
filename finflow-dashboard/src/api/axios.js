import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

let getAccessToken = () => null;
let onUnauthorized = () => {};
let refreshToken = async () => null;

export function configureApi(opts) {
  if (opts.getAccessToken) getAccessToken = opts.getAccessToken;
  if (opts.onUnauthorized) onUnauthorized = opts.onUnauthorized;
  if (opts.refreshToken) refreshToken = opts.refreshToken;
}

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let waiters = [];

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config || {};
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        if (isRefreshing) {
          await new Promise((res) => waiters.push(res));
        } else {
          isRefreshing = true;
          await refreshToken();
          waiters.forEach((w) => w());
          waiters = [];
          isRefreshing = false;
        }
        const token = getAccessToken();
        if (token) original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      } catch (e) {
        onUnauthorized();
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  },
);
