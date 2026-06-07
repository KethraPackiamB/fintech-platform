import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const themeAtom = atomWithStorage("fin.theme", "light");
export const userAtom = atomWithStorage("fin.user", null);
export const accessTokenAtom = atomWithStorage("fin.accessToken", null);
export const roleAtom = atom((get) => get(userAtom)?.role ?? "guest");

export const sidebarOpenAtom = atom(false);
export const notificationsAtom = atom([
  { id: 1, type: "success", title: "Loan #LN-4821 approved", time: "2m ago" },
  { id: 2, type: "warning", title: "EMI due in 3 days", time: "1h ago" },
  { id: 3, type: "info", title: "KYC verification updated", time: "yesterday" },
]);
export const toastsAtom = atom([]);
