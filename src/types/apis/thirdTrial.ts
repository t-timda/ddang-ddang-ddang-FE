import type { ApiResponse } from "@/types/common/api";

// 3차 재판 시작 요청
export type ThirdTrialStartRequest = {
  caseId: number;
};

// 3차 재판 시작 응답
export type ThirdTrialStartResponse = ApiResponse<{
  caseId: number;
  status: string;
}>;

// 3차 재판 상세 조회 응답
export type ThirdTrialDetailResponse = ApiResponse<{
  caseId: number;
  title: string;
  status: "THIRD" | "DONE";
  mode: "SOLO" | "VS";
  argumentA: { mainArgument: string; reasoning: string; authorId: number };
  argumentB: { mainArgument: string; reasoning: string; authorId: number };
  firstTrialVerdict?: string;
  secondTrialVerdict?: string;
}>;

// 3차 재판 판결 조회 응답 (최종 재판 API)
export type ThirdTrialJudgmentResponse = ApiResponse<{
  judgmentId: number;
  content: string;
  ratioA: number;
  ratioB: number;
  adoptedDefenses: number[];
  adoptedRebuttals: number[];
}>;

// 3차 재판 상태 변경 요청
export type ThirdTrialPatchStatusRequest = {
  status: "THIRD" | "DONE";
};

// 3차 재판 상태 변경 응답
export type ThirdTrialPatchStatusResponse = ApiResponse<null>;

// 최종 판결 상태 조회 응답
export type JudgeStatusResponse = ApiResponse<"BEFORE" | "AFTER">;
