import { create } from "zustand";
import { useShallow } from "zustand/shallow";

type ChildDialogState = {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
  openDialog: () => void;
  closeDialog: () => void;
};

export const useChildDialogStore = create<ChildDialogState>((set) => ({
  isOpen: false,
  setOpen: (value) => set({ isOpen: value }),
  openDialog: () => set({ isOpen: true }),
  closeDialog: () => set({ isOpen: false }),
}));

export const useChildDialog = () =>
  useChildDialogStore(
    useShallow((state) => ({
      isOpen: state.isOpen,
      setOpen: state.setOpen,
      openDialog: state.openDialog,
      closeDialog: state.closeDialog,
    }))
  );
