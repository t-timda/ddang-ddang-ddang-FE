import instance from "@/apis/instance";
import type {
  UserInfoResponse,
  UserProfileResponse,
  UserUpdateRequest,
  UserUpdateResponse,
  UserRecordResponse,
  UserAchievementsResponse,
  UserRankResponse,
  UserCasesResponse,
  UserProfileImageResponse
} from "@/types/apis/user";

const USER_BASE_PATH = "/api/users";

// NOTE: 브라우저에서는 "Cookie" 헤더를 JS에서 직접 설정할 수 없습니다.
// 서버와 쿠키를 주고받으려면 withCredentials: true를 사용하고 서버가
// Access-Control-Allow-Credentials 및 올바른 Access-Control-Allow-Origin을 반환해야 합니다.

const getUserRank = async (): Promise<UserRankResponse> => {
  const { data } = await instance.get<UserRankResponse>(`${USER_BASE_PATH}/rank`);
  return data;
};

const getUserAchievements = async (): Promise<UserAchievementsResponse> => {
  // 쿠키 포함이 필요하면 withCredentials만 true로 설정 (브라우저는 Cookie 헤더를 직접 설정할 수 없음)
  const { data } = await instance.get<UserAchievementsResponse>(`${USER_BASE_PATH}/achievements`, {
    withCredentials: true,
  });
  return data;
};

const getUserRecord = async (): Promise<UserRecordResponse> => {
  const { data } = await instance.get<UserRecordResponse>(`${USER_BASE_PATH}/record`);
  return data;
};

const getUserCases = async (): Promise<UserCasesResponse> => {
  const { data } = await instance.get<UserCasesResponse>(`${USER_BASE_PATH}/cases`);
  return data;
};

// 유저 기본 정보 조회 (nickname, email, userId, profileImageUrl)
const getUserInfo = async (): Promise<UserInfoResponse> => {
  const { data } = await instance.get<UserInfoResponse>(`${USER_BASE_PATH}/getInfo`);
  return data;
};

// 유저 프로필 조회 (마이페이지용 - 상세 정보)
const getProfile = async (): Promise<UserProfileResponse> => {
  const { data } = await instance.get<UserProfileResponse>(`${USER_BASE_PATH}/getInfo`);
  return data;
};

const updateProfile = async (payload: UserUpdateRequest): Promise<UserUpdateResponse> => {
  const { data } = await instance.patch<UserUpdateResponse>(`${USER_BASE_PATH}/modify`, payload);
  return data;
};

const uploadProfileImage = async (file: File): Promise<UserProfileImageResponse> => {
  const formData = new FormData();
  formData.append("profileImage", file);
  
  const { data } = await instance.post<UserProfileImageResponse>(
    `${USER_BASE_PATH}/image`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
};

export const userApi = {
  getUserInfo,
  getProfile,
  updateProfile,
  getUserRank,
  getUserAchievements,
  getUserRecord,
  getUserCases,
  uploadProfileImage,
} as const;

export type UserApi = typeof userApi;

export default userApi;