import instance from "@/apis/instance";
import type { ApiResponse } from "@/types/common/api";
import type { SecondTrialDetailsResponse, StartSecondTrialRequest, DefenseRequest, DefenseResponse, DefenseItem, LikeRequest, VoteRequest, VoteResultResponse, RebuttalRequest, RebuttalItem } from "@/types/apis/secondTrial";

{/* 2차 재판 관련 API 모음 swagger (1 o, 2 o, 3 o, 4 o, 5 o, 6 o,7 o, 8 o) */}

//2차 재판 시작 swagger 5
const startSecondTrial = async (caseId: number, body: StartSecondTrialRequest): Promise<ApiResponse<null>> => {
  const { data } = await instance.patch<ApiResponse<null>>(
    `/api/v1/cases/${caseId}/appeal`,
    body
  );
  return data;
};

//swagger 8
//2차 재판 상세 정보 조회
const getSecondTrialDetails = async (caseId: number): Promise<ApiResponse<SecondTrialDetailsResponse>> => {
  const { data } = await instance.get<ApiResponse<SecondTrialDetailsResponse>>(
    `/api/v1/cases/${caseId}/debate`
  );
  return data;
};

//변론 제출 swagger 4
const postDefense = async (caseId: number, body: DefenseRequest): Promise<ApiResponse<DefenseResponse>> => {
  const { data } = await instance.post<ApiResponse<DefenseResponse>>(
    `/api/v1/cases/${caseId}/defenses`,
    body
  );
  return data;
};

//배심원 투표 swagger 2
const postVote = async (caseId: number, body: VoteRequest): Promise<ApiResponse<null>> => {
  const { data } = await instance.post<ApiResponse<null>>(
    `/api/v1/cases/${caseId}/vote`,
    body
  );
  return data;
};

//2차재판 투표 결과 조회 swagger 7
const getVoteResult = async (caseId: number): Promise<ApiResponse<VoteResultResponse>> => {
  const { data } = await instance.get<ApiResponse<VoteResultResponse>>(
    `/api/v1/cases/${caseId}/vote/result`
  );
  return data;
};

/**
 * 반론(대댓글) 등록 swagger 1
 * POST /api/v1/rebuttals
 * RequestHeader: Content-Type: application/json, Authorization: Bearer accessToken
 * RequestBody: { defenseId, type, content, parentId }
 * Response: ApiResponse<number> (result: rebuttalId)
 */
const postRebuttal = async (body: RebuttalRequest): Promise<ApiResponse<number>> => {
  const { data } = await instance.post<ApiResponse<number>>(
    `/api/v1/rebuttals`,
    body
  );
  return data;
};

/**
 * 2차 변론 목록 조회 swagger 3
 * GET /api/v1/cases/{caseId}/defenses
 * headers: Authorization: Bearer accessToken
 * response: ApiResponse<DefenseItem[]>
 */
const getDefenses = async (caseId: number): Promise<ApiResponse<DefenseItem[]>> => {
  const { data } = await instance.get<ApiResponse<DefenseItem[]>>(
    `/api/v1/cases/${caseId}/defenses`
  );
  return data;
};

/**
 * 반론(대댓글) 목록 조회 (중첩) swagger 6
 * GET /api/v1/defenses/{defenseId}/rebuttals
 */
const getRebuttals = async (defenseId: number): Promise<ApiResponse<RebuttalItem[]>> => {
  const { data } = await instance.get<ApiResponse<RebuttalItem[]>>(
    `/api/v1/defenses/${defenseId}/rebuttals`
  );
  return data;
};

export { startSecondTrial, getSecondTrialDetails, postDefense, getDefenses, postVote, getVoteResult, postRebuttal, getRebuttals };