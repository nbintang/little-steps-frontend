import { create } from "zustand";

interface RatesState {
  quiz: Record<string, number>;
  content: Record<string, number>;
  openDialog: { type: "quiz" | "content" | null; id?: string };
  // actions
  setRate: (type: "quiz" | "content", id: string, value: number) => void;
  openRatingDialog: (type: "quiz" | "content", id: string) => void;
  closeRatingDialog: () => void;
}

export const useRates = create<RatesState>((set) => ({
  quiz: {},
  content: {},
  openDialog: { type: null },
  setRate: (type, id, value) =>
    set((state) => ({
      [type]: { ...state[type], [id]: value },
    })),
  openRatingDialog: (type, id) =>
    set({ openDialog: { type, id } }),
  closeRatingDialog: () =>
    set({ openDialog: { type: null } }),
}));
