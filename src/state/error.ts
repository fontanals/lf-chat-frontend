import { create } from "zustand";
import { ApplicationError } from "../utils/errors";

export type ErrorStore = {
  error: ApplicationError | null;
  setError: (error: ApplicationError | null) => void;
};

export const useErrorStore = create<ErrorStore>((set) => ({
  error: null,
  setError: (error) => set({ error }),
}));
