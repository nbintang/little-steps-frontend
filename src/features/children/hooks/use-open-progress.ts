import { create } from "zustand";

interface OpenProgress {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  open: () => void;
  close: () => void;
}
export const useOpenProgress = create<OpenProgress>((set) => ({
  isOpen: false,
  setOpen: (isOpen) => set({ isOpen }),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
