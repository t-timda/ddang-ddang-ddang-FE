import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  AxiosHeaders,
} from "axios";

import { PATHS } from "@/constants";
import { useAuthStore, type AuthStore } from "@/stores/useAuthStore";
import type { TokenRefreshRequest, TokenRefreshResponse } from "@/types/apis/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const AUTH_LOGIN_PATH = "/api/v1/auth/login";
const AUTH_REFRESH_PATH = "/api/v1/auth/refresh";

const instance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const getAuthState = (): AuthStore => useAuthStore.getState();

const logoutAndRedirect = () => {
  getAuthState().setLogout();
  window.location.href = PATHS.LOGIN;
};

const withAuthToken = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const { accessToken } = getAuthState();

  if (!accessToken) {
    return config;
  }

  const headers = AxiosHeaders.from(config.headers ?? {});
  headers.set("Authorization", `Bearer ${accessToken}`);

  config.headers = headers;

  return config;
};

// 요청 인터셉터
instance.interceptors.request.use(withAuthToken);

type AuthRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const shouldBypassAuthHandling = (url?: string): boolean => {
  if (!url) {
    return false;
  }

  return url.includes(AUTH_LOGIN_PATH) || url.includes(AUTH_REFRESH_PATH);
};

let refreshPromise: Promise<string> | null = null;

const requestTokenRefresh = (): Promise<string> => {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const { refreshToken, email } = getAuthState();

      if (!refreshToken || !email) {
        throw new Error("리프레시 토큰 정보가 없습니다.");
      }

      const payload: TokenRefreshRequest = {
        refreshToken,
        email,
      };

      const { data } = await axios.post<TokenRefreshResponse>(
        `${API_BASE_URL}${AUTH_REFRESH_PATH}`,
        payload,
        { withCredentials: true }
      );

      if (!data.isSuccess || !data.result?.accessToken) {
        throw new Error(data.message || "토큰 재발급에 실패했습니다.");
      }

      useAuthStore.getState().setLogin({ accessToken: data.result.accessToken });

      return data.result.accessToken;
    })().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
};

// 응답 인터셉터: 401 (Unauthorized), 403 (Forbidden: 만료) 에러 시 처리
instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequest = error.config as AuthRequestConfig | undefined;

    if (!status || (status !== 401 && status !== 403) || !originalRequest) {
      return Promise.reject(error);
    }

    if (shouldBypassAuthHandling(originalRequest.url)) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      logoutAndRedirect();
      return Promise.reject(error);
    }

    try {
      originalRequest._retry = true;
      const nextAccessToken = await requestTokenRefresh();
      const headers = AxiosHeaders.from(originalRequest.headers ?? {});
      headers.set("Authorization", `Bearer ${nextAccessToken}`);
      originalRequest.headers = headers;
      return instance(originalRequest);
    } catch (refreshError) {
      logoutAndRedirect();
      return Promise.reject(refreshError);
    }
  }
);

export default instance;
