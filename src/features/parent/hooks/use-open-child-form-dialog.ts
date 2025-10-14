import { ChildGender } from "@/lib/enums/child-gender";
import { create } from "zustand";
import { useShallow } from "zustand/shallow";

type ChildDialogState = {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
  openDialog: (child?: { id: string; name: string; avatarUrl?: string, gender: ChildGender, birthDate: Date | string } | null) => void;
  child?: { id: string; name: string; avatarUrl?: string, gender: ChildGender, birthDate: Date | string } | null; 
  closeDialog: () => void;
};

export const useChildDialogStore = create<ChildDialogState>((set) => ({
  child: null,
  isOpen: false,
  setOpen: (value) => set({ isOpen: value }),
  openDialog: (child) => set({ isOpen: true, child: child }),
  closeDialog: () => set({ isOpen: false }),
}));

export const useChildDialog = () =>
  useChildDialogStore(
    useShallow((state) => ({
      isOpen: state.isOpen,
      setOpen: state.setOpen,
      openDialog: state.openDialog,
      closeDialog: state.closeDialog,
      child: state.child
    }))
  );
