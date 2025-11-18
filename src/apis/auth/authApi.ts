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

const syncAccessToken = (token?: string | null) => {
  if (!token) {
    return;
  }

  useAuthStore.getState().setLogin({ accessToken: token });
};

const postSignup = async (payload: SignupRequest): Promise<SignupResponse> => {
  const { data } = await instance.post<SignupResponse>(
    `${AUTH_BASE_PATH}/signup`,
    payload
  );

  return data;
};

const postLogin = async (payload: LoginRequest): Promise<LoginResponse> => {
  const { data } = await instance.post<LoginResponse>(
    `${AUTH_BASE_PATH}/login`,
    payload
  );

  syncAccessToken(data.result?.accessToken ?? null);

  return data;
};

const postTokenRefresh = async (
  payload: TokenRefreshRequest
): Promise<TokenRefreshResponse> => {
  const { data } = await instance.post<TokenRefreshResponse>(
    `${AUTH_BASE_PATH}/refresh`,
    payload
  );

  syncAccessToken(data.result?.accessToken ?? null);

  return data;
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
