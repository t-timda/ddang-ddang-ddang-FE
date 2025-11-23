import instance from "@/apis/instance";
import type {
  ThirdTrialStartRequest,
  ThirdTrialStartResponse,
  ThirdTrialDetailResponse,
  ThirdTrialJudgmentResponse,
  ThirdTrialPatchStatusRequest,
  ThirdTrialPatchStatusResponse,
  JudgeStatusResponse,
} from "@/types/apis/thirdTrial";

const BASE = "/api/v1/cases";

// 3차 재판 시작
const postThirdTrialStart = async (body: ThirdTrialStartRequest) => {
  const { data } = await instance.post<ThirdTrialStartResponse>(
    `${BASE}/${body.caseId}/third-trial/start`,
    body
  );
  return data;
};

// 3차 재판 상세 조회
const getThirdTrialDetail = async (caseId: number) => {
  const { data } = await instance.get<ThirdTrialDetailResponse>(
    `${BASE}/${caseId}/third-trial`
  );
  return data;
};

// 3차 재판 판결 조회 (최종 재판 API)
const getThirdTrialJudgment = async (caseId: number) => {
  const { data } = await instance.get<ThirdTrialJudgmentResponse>(
    `/api/final/judge/${caseId}`
  );
  return data;
};

// 3차 재판 상태 변경
const patchThirdTrialStatus = async (
  caseId: number,
  body: ThirdTrialPatchStatusRequest
) => {
  const { data } = await instance.patch<ThirdTrialPatchStatusResponse>(
    `${BASE}/${caseId}/third-trial/status`,
    body
  );
  return data;
};

// 최종 판결 상태 조회
const getJudgeStatus = async (caseId: number) => {
  const { data } = await instance.get<JudgeStatusResponse>(
    `/api/final/judge/${caseId}/judgeStatus`
  );
  return data;
};

// 최종 판결 생성
const postCreateJudgment = async (caseId: number) => {
  const { data } = await instance.post<ThirdTrialJudgmentResponse>(
    `/api/final/judge/${caseId}`
  );
  return data;
};

export const thirdTrialApi = {
  postThirdTrialStart,
  getThirdTrialDetail,
  getThirdTrialJudgment,
  patchThirdTrialStatus,
  getJudgeStatus,
  postCreateJudgment,
} as const;

export type ThirdTrialApi = typeof thirdTrialApi;
