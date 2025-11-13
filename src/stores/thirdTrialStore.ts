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
  selectedArguments: SelectedArgumentsMap;
  setStep: (step: ThirdTrialStep) => void;
  setSelectedArguments: (map: SelectedArgumentsMap) => void;
  updateSelectedArguments: (side: ThirdTrialSide, ids: number[]) => void;
  reset: () => void;
};

export const useThirdTrialStore = create<ThirdTrialState>((set) => ({
  step: "adopt",
  selectedArguments: {
    first: [],
    second: [],
  },
  setStep: (step) => set({ step }),
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
      selectedArguments: {
        first: [],
        second: [],
      },
    }),
}));
