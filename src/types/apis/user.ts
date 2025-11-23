import type { ApiResponse } from "@/types/common/api";

// getInfo API 응답 타입 (간단한 유저 정보)
export type UserInfo = {
  userId: number;
  nickname: string;
  profileImageUrl: string;
  email: string;
  rank: string;
};

// ⭐️ User 테이블의 DB 스키마와 API 응답을 통합한 최종 사용자 프로필 데이터 타입
export type UserProfileData = {
  // DB 기본 필드
  user_id: number;
  nickname: string;
  email: string;
  created_at: string; // 가입일 (DB 필드)
  exp: number; // 누적 경험치 (DB 필드)
  total_points: number; // 포인트 (DB 필드)

  // API 응답/MyPage UI에 필요한 필드
  profileImageUrl: string | null;
  phone_number: string; // 전화번호 (조회/수정 시 필요)

  // 전적 및 칭호 관련 필드 (백엔드 계산 필드 가정)
  win_count: number;
  loss_count: number;
  current_grade: string; // 현재 칭호/등급
  next_grade: string; // 다음 칭호
  trials_to_next_grade: number; // 다음 등급까지 남은 재판 수
  total_trials: number; // 총 참여 재판 수
  grade_progress: number; // 등급 진행률 (%)
  grade_history: string[]; // 칭호 단계 히스토리
};

// 사용자 기본 정보 조회 응답 타입
export type UserInfoResponse = ApiResponse<UserInfo | null>;

// 사용자 프로필 조회 응답 타입
export type UserProfileResponse = ApiResponse<UserProfileData | null>;

// 사용자 정보 업데이트 요청 타입
export type UserUpdateRequest = {
  nickname?: string;
  profileImageUrl?: string;
  email?: string;
};

// 사용자 정보 업데이트 응답 타입
export type UserUpdateResponse = ApiResponse<{
  nickname: string;
  profileImageUrl: string;
  email: string;
}>;

// 전적 조회 응답 타입
export type UserRecordResponse = ApiResponse<{
  id: number;
  winCnt: number;
  loseCnt: number;
}>;

// 업적 조회 응답 타입
export type Achievement = {
  userId: number;
  achievementId: number;
  achievementName: string;
  achievementDescription: string;
  achievementIconUrl: string;
  achievementTime: string;
};

export type UserAchievementsResponse = ApiResponse<Achievement[]>;

// 사용자 등급 조회 응답 타입
export type UserRankResponse = ApiResponse<{
  id: number;
  rank: string;
  exp: number;
}>;

// 사용자 사건 기록 조회 응답 타입
export type CaseRecord = {
  caseId: number;
  title: string;
  status: "PENDING" | "FIRST" | "SECOND" | "THIRD" | "DONE"; // 상태
  caseResult: "WIN" | "LOSE" | "PENDING"; // 결과
  mainArguments: string[]; // 주요 주장
};

export type ExpHistoryItem = {
  id: number;
  amount: number;
  description: string;
  createdAt: string;
};

export type UserExpHistoryResponse = ApiResponse<ExpHistoryItem[]>;

export type UserCasesResponse = ApiResponse<CaseRecord[]>;

// 프로필 사진 업로드 응답 타입
export type UserProfileImageResponse = ApiResponse<{}>;