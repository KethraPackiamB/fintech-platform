import { useEffect } from "react";
import { Provider as JotaiProvider, useAtom, useAtomValue, useSetAtom } from "jotai";
import { themeAtom, accessTokenAtom, userAtom, toastsAtom } from "../store/atoms";
import { configureApi } from "../api/axios";

function ThemeBridge({ children }) {
  const theme = useAtomValue(themeAtom);
  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
    // Lazy-load Bootstrap JS bundle (dropdowns, toasts, modals) only in browser
    if (typeof window !== "undefined") {
      import("bootstrap/dist/js/bootstrap.bundle.min.js").catch(() => {});
    }
  }, [theme]);
  return children;
}

function ApiBridge({ children }) {
  const [token, setToken] = useAtom(accessTokenAtom);
  const setUser = useSetAtom(userAtom);
  useEffect(() => {
    configureApi({
      getAccessToken: () => token,
      onUnauthorized: () => {
        setToken(null);
        setUser(null);
      },
      refreshToken: async () => null,
    });
  }, [token, setToken, setUser]);
  return children;
}

function ToastViewport() {
  const [toasts, setToasts] = useAtom(toastsAtom);
  useEffect(() => {
    if (!toasts.length) return;
    const timer = setTimeout(() => setToasts((t) => t.slice(1)), 3500);
    return () => clearTimeout(timer);
  }, [toasts, setToasts]);
  return (
    <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 1080 }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast show align-items-center text-bg-${t.variant || "primary"} border-0 mb-2`}
        >
          <div className="d-flex">
            <div className="toast-body">{t.message}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AppProviders({ children }) {
  return (
    <JotaiProvider>
      <ThemeBridge>
        <ApiBridge>
          {children}
          <ToastViewport />
        </ApiBridge>
      </ThemeBridge>
    </JotaiProvider>
  );
}

export function useToast() {
  const setToasts = useSetAtom(toastsAtom);
  return (message, variant = "primary") =>
    setToasts((t) => [...t, { id: Date.now() + Math.random(), message, variant }]);
}
