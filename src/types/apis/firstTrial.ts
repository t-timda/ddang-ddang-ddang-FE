import type { ApiResponse } from "@/types/common/api";

export type FirstTrialCreateRequest = {
  mode: "SOLO";
  title: string;
  argumentAMain: string;
  argumentAReasoning: string;
  argumentBMain: string;
  argumentBReasoning: string;
};

export type FirstTrialCreateResponse = ApiResponse<{ caseId: number }>;

export type FirstTrialDetailResponse = ApiResponse<{
  caseId: number;
  title: string;
  status: "FIRST" | "DONE";
  mode: "SOLO";
  argumentA: { mainArgument: string; reasoning: string; authorId: number };
  argumentB: { mainArgument: string; reasoning: string; authorId: number };
}>;

export type FirstTrialJudgmentResponse = ApiResponse<{
  judgeIllustrationUrl: string;
  verdict: string;
  conclusion: string;
  ratioA: number;
  ratioB: number;
}>;

export type FirstTrialPatchStatusRequest = { status: "FIRST" | "DONE" };
export type FirstTrialPatchStatusResponse = ApiResponse<null>;
