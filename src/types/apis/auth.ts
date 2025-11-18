import type { ApiResponse } from "@/types/common/api";

export type SignupRequest = {
  nickname: string;
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type TokenRefreshRequest = {
  email: string;
  refreshToken: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AccessToken = {
  accessToken: string;
};

// 이메일 인증번호 발송
export type SendEmailCodeRequest = { email: string };

// 이메일 인증번호 검증
export type VerifyEmailCodeRequest = { email: string; code: string };

export type SignupResponse = ApiResponse<null>;
export type LoginResponse = ApiResponse<AuthTokens | null>;
export type TokenRefreshResponse = ApiResponse<AccessToken | null>;
export type SendEmailCodeResponse = ApiResponse<null>;
export type VerifyEmailCodeResponse = ApiResponse<null>;
