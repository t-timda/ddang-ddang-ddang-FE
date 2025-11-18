import instance from "@/apis/instance";
import type {
  GetHotCasesResponse,
  GetMyDefensesResponse,
  GetMyOngoingCasesResponse,
} from "@/types/apis/home";

const MY_DEFENSES_PATH = "/api/home/users/defenses";
const MY_ONGOING_CASES_PATH = "/api/home/users/cases";
const HOME_HOT_PATH = "/api/home/hot";

// 로그인 필요 (Bearer 토큰은 instance가 자동으로 붙임)
export const getMyDefenses = async () => {
  const { data } = await instance.get<GetMyDefensesResponse>(MY_DEFENSES_PATH);
  return data;
};

export const getMyOngoingCases = async () => {
  const { data } = await instance.get<GetMyOngoingCasesResponse>(
    MY_ONGOING_CASES_PATH
  );
  return data;
};

// 공개 API
export const getHotCases = async () => {
  const { data } = await instance.get<GetHotCasesResponse>(HOME_HOT_PATH);
  return data;
};

export const homeApi = {
  getMyDefenses,
  getMyOngoingCases,
  getHotCases,
} as const;

export type HomeApi = typeof homeApi;
