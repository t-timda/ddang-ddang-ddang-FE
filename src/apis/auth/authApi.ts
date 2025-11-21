import axios from "axios";

import instance from "@/apis/instance";
import { useAuthStore } from "@/stores/useAuthStore";
import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  TokenRefreshRequest,
  TokenRefreshResponse,
  SendEmailCodeRequest,
  VerifyEmailCodeRequest,
  SendEmailCodeResponse,
  VerifyEmailCodeResponse,
} from "@/types/apis/auth";

const AUTH_BASE_PATH = "/api/v1/auth";

const postSignup = async (payload: SignupRequest): Promise<SignupResponse> => {
  const { data } = await instance.post<SignupResponse>(
    `${AUTH_BASE_PATH}/signup`,
    payload
  );

  return data;
};

const postLogin = async (payload: LoginRequest): Promise<LoginResponse> => {
  try {
    const { data } = await instance.post<LoginResponse>(
      `${AUTH_BASE_PATH}/login`,
      payload
    );

    if (!data.isSuccess || !data.result?.accessToken || !data.result.refreshToken) {
      throw new Error(data.message || "로그인에 실패했습니다.");
    }

    useAuthStore.getState().setLogin({
      accessToken: data.result.accessToken,
      refreshToken: data.result.refreshToken,
      email: payload.email,
    });

    return data;
  } catch (error) {
    if (axios.isAxiosError<LoginResponse>(error)) {
      throw new Error(error.response?.data?.message || "로그인에 실패했습니다.");
    }

    throw error instanceof Error
      ? error
      : new Error("로그인에 실패했습니다.");
  }
};

const postTokenRefresh = async (
  payload: TokenRefreshRequest
): Promise<TokenRefreshResponse> => {
  try {
    const { data } = await instance.post<TokenRefreshResponse>(
      `${AUTH_BASE_PATH}/refresh`,
      payload
    );

    if (!data.isSuccess || !data.result?.accessToken) {
      throw new Error(data.message || "토큰 재발급에 실패했습니다.");
    }

    useAuthStore.getState().setLogin({ accessToken: data.result.accessToken });

    return data;
  } catch (error) {
    if (axios.isAxiosError<TokenRefreshResponse>(error)) {
      throw new Error(
        error.response?.data?.message || "토큰 재발급에 실패했습니다."
      );
    }

    throw error instanceof Error
      ? error
      : new Error("토큰 재발급에 실패했습니다.");
  }
};

const postSendEmailCode = async (
  payload: SendEmailCodeRequest
): Promise<SendEmailCodeResponse> => {
  const { data } = await instance.post<SendEmailCodeResponse>(
    `${AUTH_BASE_PATH}/email/send-code`,
    payload
  );
  return data;
};

const postVerifyEmailCode = async (
  payload: VerifyEmailCodeRequest
): Promise<VerifyEmailCodeResponse> => {
  const { data } = await instance.post<VerifyEmailCodeResponse>(
    `${AUTH_BASE_PATH}/email/verify-code`,
    payload
  );
  return data;
};

export const authApi = {
  postSignup,
  postLogin,
  postTokenRefresh,
  postSendEmailCode,
  postVerifyEmailCode,
} as const;

export type AuthApi = typeof authApi;

export default authApi;
