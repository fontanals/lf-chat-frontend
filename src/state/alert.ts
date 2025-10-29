import { create } from "zustand";

export type Alert = {
  severity: "info" | "warning" | "error" | "success";
  message: string;
};

export type AlertStore = {
  showAlert: boolean;
  alert: Alert | null;
  displayAlert: (alert: Alert) => void;
  clearAlert: () => void;
};

export const useAlertStore = create<AlertStore>((set) => ({
  showAlert: false,
  alert: null,
  displayAlert: (alert) => set({ showAlert: true, alert }),
  clearAlert: () => {
    set({ showAlert: false });
    setTimeout(() => set({ alert: null }), 100);
  },
}));
