import type { ApiResponse } from "@/types/common/api";

/* ---------------------------------------------------------
   1) 생성 요청 타입 (SOLO + PARTY 공통)
   --------------------------------------------------------- */
export type FirstTrialCreateRequest = {
  mode: "SOLO" | "PARTY";
  title: string;
  argumentAMain: string;
  argumentAReasoning: string;

  // VS에서는 B 없음
  // SOLO에서는 B필수지만, VS 때문에 optional 허용
  argumentBMain?: string;
  argumentBReasoning?: string;
};

export type FirstTrialCreateResponse = ApiResponse<{ caseId: number }>;

/* ---------------------------------------------------------
   2) SOLO 모드 상세조회 타입 (argumentB 절대 null 아님)
   --------------------------------------------------------- */
export type FirstTrialDetailResponseSolo = ApiResponse<{
  caseId: number;
  title: string;
  status: "FIRST" | "DONE";
  mode: "SOLO";
  argumentA: {
    mainArgument: string;
    reasoning: string;
    authorId: number;
  };
  argumentB: {
    mainArgument: string;
    reasoning: string;
    authorId: number;
  }; // SOLO는 argumentB null 불가
}>;

/* ---------------------------------------------------------
   3) VS 모드 상세조회 타입 (argumentB는 null 가능)
   --------------------------------------------------------- */
export type FirstTrialDetailResponseVS = ApiResponse<{
  caseId: number;
  title: string;
  status: "FIRST" | "DONE";
  mode: "PARTY";
  argumentA: {
    mainArgument: string;
    reasoning: string;
    authorId: number;
  };
  argumentB: {
    mainArgument: string;
    reasoning: string;
    authorId: number;
  } | null; // VS는 참여 전 null 허용
}>;

/* ---------------------------------------------------------
   4) 합쳐진 최종 상세조회 타입 (SOLO | PARTY)
   --------------------------------------------------------- */
export type FirstTrialDetailResponse =
  | FirstTrialDetailResponseSolo
  | FirstTrialDetailResponseVS;

/* ---------------------------------------------------------
   5) 판결문 타입 (SOLO / PARTY 동일 구조)
   --------------------------------------------------------- */
export type FirstTrialJudgmentResponse = ApiResponse<{
  judgeIllustrationUrl: string;
  verdict: string;
  conclusion: string;
  ratioA: number;
  ratioB: number;
}>;

/* ---------------------------------------------------------
   6) 상태 변경 (FIRST → DONE)
   --------------------------------------------------------- */
export type FirstTrialPatchStatusRequest = {
  status: "FIRST" | "DONE";
};

export type FirstTrialPatchStatusResponse = ApiResponse<null>;
