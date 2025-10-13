import { PostAPI } from "@/types/forum";
import { create } from "zustand";

type OpenFormState = { 
  openForm: boolean;
  type: "post" | "thread" | "edit-post" | null; // null artinya tidak ada form terbuka
  setOpenForm: (openForm: boolean, type?: "post" | "thread" | "edit-post",  post?: PostAPI ) => void;
  post: PostAPI | null;

};

export const useOpenForm = create<OpenFormState>((set) => ({
  openForm: false,
  type: null,
  setOpenForm: (openForm, type,  post) => set({ openForm, type: openForm ? type ?? null : null, post }),
  post: null
}));
