import { create } from "zustand";

type OpenFormState = { 
  openForm: boolean;
  type: "post" | "thread" | null; // null artinya tidak ada form terbuka
  setOpenForm: (openForm: boolean, type?: "post" | "thread") => void;
};

export const useOpenForm = create<OpenFormState>((set) => ({
  openForm: false,
  type: null,
  setOpenForm: (openForm, type) => set({ openForm, type: openForm ? type ?? null : null }),
}));
