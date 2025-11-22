import { create } from "zustand";
import type {
  SelectedArgumentsMap,
  ThirdTrialSide,
} from "@/types/thirdTrial";

export type ThirdTrialStep =
  | "adopt"      // 변론 채택
  | "review"     // 채택 검토
  | "loading"    // 판결 로드(애니메이션)
  | "verdict";   // 판결

type ThirdTrialState = {
  step: ThirdTrialStep;
  caseId: number | null;
  selectedArguments: SelectedArgumentsMap;
  setStep: (step: ThirdTrialStep) => void;
  setCaseId: (id: number | null) => void;
  setSelectedArguments: (map: SelectedArgumentsMap) => void;
  updateSelectedArguments: (side: ThirdTrialSide, ids: number[]) => void;
  reset: () => void;
};

export const useThirdTrialStore = create<ThirdTrialState>((set) => ({
  step: "adopt",
  caseId: null,
  selectedArguments: {
    first: [],
    second: [],
  },
  setStep: (step) => set({ step }),
  setCaseId: (id) => set({ caseId: id }),
  setSelectedArguments: (map) => set({ selectedArguments: map }),
  updateSelectedArguments: (side, ids) =>
    set((state) => ({
      selectedArguments: {
        ...state.selectedArguments,
        [side]: ids,
      },
    })),
  reset: () =>
    set({
      step: "adopt",
      caseId: null,
      selectedArguments: {
        first: [],
        second: [],
      },
    }),
}));
