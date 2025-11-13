import { create } from "zustand";

export type FirstTrialStep =
  | "start" // 재판 시작
  | "submit" // 입장문 제출
  | "loading" // 제출 중
  | "result" // 결과 확인
  | "judge"; // 판결문

type FirstTrialState = {
  step: FirstTrialStep;
  setStep: (step: FirstTrialStep) => void;
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
  setStep: (step) => set({ step }),
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
  reset: () => set({ step: "start" }),
}));
