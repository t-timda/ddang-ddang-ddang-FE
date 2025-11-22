import type { ApiResponse } from "@/types/common/api";

export type CaseStatus = "PENDING" | "FIRST" | "SECOND" | "THIRD" | "DONE";

// 2차 재판 진행 중인 사건 응답 DTO (CaseOnResponseDto)
export type CaseOnResponseDto = {
  caseId: number;
  title: string;
  status: CaseStatus;
  mainArguments: string[]; // [argumentA, argumentB]
};

// 완료된 사건 응답 DTO
export type FinishedCaseResponseDto = {
  caseId: number;
  title: string;
  status: CaseStatus;
  mainArguments: string[];
};

// 판결 응답 DTO (JudgmentResponseDto)
export type JudgmentResponseDto = {
  caseId: number;
  title?: string;
  verdict?: string;
  conclusion?: string;
  ratioA?: number;
  ratioB?: number;
  finalVerdict?: string;
  judgeIllustrationUrl?: string;
  createdAt?: string;
  completedAt?: string;
};

// 진행중인 재판 목록 응답 (2차 재판 진행 중인 사건 목록)
export type OngoingCasesResponse = ApiResponse<CaseOnResponseDto[]>;

// 완료된 재판 목록 응답
export type FinishedCasesResponse = ApiResponse<FinishedCaseResponseDto[]>;

// 최종 판결 히스토리 응답 (아카이브 전체)
export type JudgmentHistoryResponse = ApiResponse<JudgmentResponseDto[]>;

// 특정 케이스의 판결 히스토리 응답 (1차, 2차, 3차 재판 결과들)
export type CaseJudgmentHistoryResponse = ApiResponse<JudgmentResponseDto[]>;
