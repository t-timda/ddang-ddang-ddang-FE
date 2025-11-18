import instance from "@/apis/instance";
import type {
  FirstTrialCreateRequest,
  FirstTrialCreateResponse,
  FirstTrialDetailResponse,
  FirstTrialJudgmentResponse,
  FirstTrialPatchStatusRequest,
  FirstTrialPatchStatusResponse,
} from "@/types/apis/firstTrial";

const BASE = "/api/v1/cases";

const postFirstTrialCreate = async (body: FirstTrialCreateRequest) => {
  const { data } = await instance.post<FirstTrialCreateResponse>(
    `${BASE}`,
    body
  );
  return data;
};

const getFirstTrialDetail = async (caseId: number) => {
  const { data } = await instance.get<FirstTrialDetailResponse>(
    `${BASE}/${caseId}`
  );
  return data;
};

const getFirstTrialJudgment = async (caseId: number) => {
  const { data } = await instance.get<FirstTrialJudgmentResponse>(
    `${BASE}/${caseId}/judgment`
  );
  return data;
};

const patchFirstTrialStatus = async (
  caseId: number,
  body: FirstTrialPatchStatusRequest
) => {
  const { data } = await instance.patch<FirstTrialPatchStatusResponse>(
    `${BASE}/${caseId}/status`,
    body
  );
  return data;
};

export const firstTrialApi = {
  postFirstTrialCreate,
  getFirstTrialDetail,
  getFirstTrialJudgment,
  patchFirstTrialStatus,
} as const;

export type FirstTrialApi = typeof firstTrialApi;
