import { create } from "zustand";
import { LocalStorageUtils } from "../utils/local-storage";

export type Theme = "light" | "dark" | "system";

export type ThemeStore = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: LocalStorageUtils.getItem<Theme>("theme", "system"),
  setTheme: (theme: Theme) => {
    LocalStorageUtils.setItem("theme", theme);
    set({ theme });
  },
}));
