import instance from "@/apis/instance";
import type {
  AdoptCandidatesResponse,
  AdoptRequestDto,
  AdoptResultResponse,
  AdoptStatusResponse,
  BestAdoptCandidatesResponse,
} from "@/types/apis/adopt";

const BASE = "/api/final/adopt";

/**
 * 채택된 변론/반론 조회
 * GET /api/final/adopt/{caseId}
 */
const getAdoptedItems = async (
  caseId: number
): Promise<AdoptCandidatesResponse> => {
  const { data } = await instance.get<AdoptCandidatesResponse>(
    `${BASE}/${caseId}`
  );
  return data;
};

/**
 * 수동 채택 (변론/반론 선택)
 * POST /api/final/adopt/{caseId}
 */
const postAdoptItems = async (
  caseId: number,
  body: AdoptRequestDto
): Promise<AdoptResultResponse> => {
  const { data } = await instance.post<AdoptResultResponse>(
    `${BASE}/${caseId}`,
    body
  );
  return data;
};

/**
 * 최종심으로 사건 상태 변경 (3차 재판 시작)
 * POST /api/final/adopt/{caseId}/third
 */
const postStartThirdTrial = async (
  caseId: number
): Promise<AdoptStatusResponse> => {
  const { data } = await instance.post<AdoptStatusResponse>(
    `${BASE}/${caseId}/third`
  );
  return data;
};

/**
 * 자동 채택 (좋아요 많은 순)
 * POST /api/final/adopt/{caseId}/auto
 */
const postAutoAdopt = async (
  caseId: number
): Promise<AdoptResultResponse> => {
  const { data } = await instance.post<AdoptResultResponse>(
    `${BASE}/${caseId}/auto`
  );
  return data;
};

/**
 * 좋아요 많은 순으로 변론/반론 조회
 * GET /api/final/adopt/{caseId}/best
 */
const getBestAdoptItems = async (
  caseId: number
): Promise<BestAdoptCandidatesResponse> => {
  const { data } = await instance.get<BestAdoptCandidatesResponse>(
    `${BASE}/${caseId}/best`
  );
  return data;
};

export const adoptApi = {
  getAdoptedItems,
  postAdoptItems,
  postStartThirdTrial,
  postAutoAdopt,
  getBestAdoptItems,
};
