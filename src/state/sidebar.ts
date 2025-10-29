import { create } from "zustand";

export type SidebarStore = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const useSidebarStore = create<SidebarStore>((set) => ({
  isOpen: true,
  setIsOpen: (isOpen) => set({ isOpen }),
}));
