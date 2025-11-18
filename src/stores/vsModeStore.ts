// /dev/src/stores/vsModeStore.ts
import { create } from "zustand";

export type VsModeStep =
  | "waiting"     // 대기 중인 재판 리스트
  | "join"        // 재판 참가 (입장 선택)
  | "submit"      // B측 의견 작성
  | "loading"     // 매칭 대기
  | "result"      // 판결 완료
  | "judge";      // AI 판결 상세

type VsModeState = {
  step: VsModeStep;
  caseId: number | null;
  setStep: (step: VsModeStep) => void;
  setCaseId: (id: number | null) => void;
  next: () => void;
  prev: () => void;
  reset: () => void;
};

const order: VsModeStep[] = [
  "waiting",
  "join",
  "submit",
  "loading",
  "result",
  "judge",
];

export const useVsModeStore = create<VsModeState>((set, get) => ({
  step: "waiting",
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
  reset: () => set({ step: "waiting", caseId: null }),
}));