import { create } from "zustand";

export type FirstTrialStep =
  | "start"
  | "submit"
  | "loading"
  | "result"
  | "judge"
  | "vsSubmit";

type FirstTrialState = {
  step: FirstTrialStep;
  caseId: number | null;
  setStep: (step: FirstTrialStep) => void;
  setCaseId: (id: number | null) => void;
  next: () => void;
  prev: () => void;
  reset: () => void;
};

const order: FirstTrialStep[] = [
  "start",
  "submit",
  "loading",
  "result",
  "judge",
];

export const useFirstTrialStore = create<FirstTrialState>((set, get) => ({
  step: "start",
  caseId: null,
  setStep: (step) => set({ step }),
  setCaseId: (id) => set({ caseId: id }),
  next: () => {
    const current = get().step;
    const idx = order.indexOf(current);
    const next = order[Math.min(idx + 1, order.length - 1)];
    if (next !== current) set({ step: next });
  },
  prev: () => {
    const current = get().step;
    const idx = order.indexOf(current);
    const prev = order[Math.max(idx - 1, 0)];
    if (prev !== current) set({ step: prev });
  },
  reset: () => set({ step: "start", caseId: null }),
}));
