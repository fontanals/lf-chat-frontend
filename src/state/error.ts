import { create } from "zustand";
import { ApplicationError } from "../utils/errors";

export type ErrorStore = {
  showError: boolean;
  error: ApplicationError | null;
  displayError: (error: ApplicationError) => void;
  clearError: () => void;
};

export const useErrorStore = create<ErrorStore>((set) => ({
  showError: false,
  error: null,
  displayError: (error) => set({ showError: true, error }),
  clearError: () => set({ showError: false }),
}));
