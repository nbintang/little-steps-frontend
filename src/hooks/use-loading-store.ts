 
import { create } from "zustand";

type LoadingState = {
  count: number; // internal counter
  loading: boolean;
  show: () => void; // increment
  hide: () => void; // decrement
  setLoading: (v: boolean) => void; // force
  reset: () => void;
};

const useLoadingStore = create<LoadingState>((set) => ({
  count: 0,
  loading: false,
  show: () =>
    set((s) => {
      const next = s.count + 1;
      return { count: next, loading: true };
    }),
  hide: () =>
    set((s) => {
      const next = Math.max(0, s.count - 1);
      return { count: next, loading: next > 0 };
    }),
  setLoading: (v: boolean) =>
    set(() => ({
      count: v ? 1 : 0,
      loading: v,
    })),
  reset: () => set(() => ({ count: 0, loading: false })),
}));

export default useLoadingStore;
