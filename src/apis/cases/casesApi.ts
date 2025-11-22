import instance from "@/apis/instance";
import type {
  FinishedCasesResponse,
  JudgmentHistoryResponse,
  OngoingCasesResponse,
} from "@/types/apis/cases";

const BASE = "/api/v1/cases";

// 진행중인 재판 목록 조회 (2차 재판 진행 중인 사건)
const getOngoingCases = async (): Promise<OngoingCasesResponse> => {
  const { data } = await instance.get<OngoingCasesResponse>(
    `${BASE}/second`
  );
  return data;
};

// 최종 판결 히스토리 조회 (아카이브)
const getFinalJudgmentHistory = async (caseId: number): Promise<JudgmentHistoryResponse> => {
  const { data } = await instance.get<JudgmentHistoryResponse>(
    `/api/final/judge/${caseId}/history`
  );
  return data;
};

// 완료된 재판 목록 조회
const getFinishedCases = async (): Promise<FinishedCasesResponse> => {
  const { data } = await instance.get<FinishedCasesResponse>(
    `/api/v1/finished`
  );
  return data;
};

export const casesApi = {
  getOngoingCases,
  getFinalJudgmentHistory,
  getFinishedCases,
} as const;

export type CasesApi = typeof casesApi;
