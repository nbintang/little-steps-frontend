import { create } from "zustand";

interface ScheduleDialogState {
  isOpen: boolean;
  child: {
    id: string | null;
    name: string;
    avatarUrl?: string;
  };
  editingScheduleId: string | null;

  // Actions
  openDialog: (child: { id: string; name: string; avatarUrl?: string }) => void;
  closeDialog: () => void;
  setEditingScheduleId: (id: string | null) => void;
}

export const useScheduleDialogStore = create<ScheduleDialogState>((set) => ({
  isOpen: false,
  editingScheduleId: null,
  child: {
    id: null,
    name: "",
    avatarUrl: undefined,
  },
  openDialog: (child) =>
    set({
      isOpen: true,
      child: {
        id: child.id,
        name: child.name,
        avatarUrl: child.avatarUrl,
      },
      editingScheduleId: null,
    }),

  closeDialog: () =>
    set({
      isOpen: false,
      child: {
        id: null,
        name: "",
        avatarUrl: undefined,
      },
      editingScheduleId: null,
    }),

  setEditingScheduleId: (id) => set({ editingScheduleId: id }),
}));
