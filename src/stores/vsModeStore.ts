import { create } from "zustand";

type VsModeStep =
  | "waiting"
  | "join"
  | "submit"
  | "loading"
  | "result"
  | "judge";

interface VsModeState {
  step: VsModeStep;
  caseId: number | null;

  setStep: (s: VsModeStep) => void;
  setCaseId: (id: number) => void;
  next: () => void;
  reset: () => void;
}

export const useVsModeStore = create<VsModeState>((set) => ({
  step: "waiting",
  caseId: null,

  setStep: (s) => set({ step: s }),
  setCaseId: (id) => set({ caseId: id }),

  next: () =>
    set((state) => {
      const order: VsModeStep[] = [
        "waiting",
        "join",
        "submit",
        "loading",
        "result",
        "judge",
      ];
      const idx = order.indexOf(state.step);
      return idx < order.length - 1 ? { step: order[idx + 1] } : state;
    }),

  reset: () => set({ step: "waiting", caseId: null }),
}));
