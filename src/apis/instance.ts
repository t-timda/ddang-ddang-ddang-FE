import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  AxiosHeaders,
} from "axios";

import { PATHS } from "@/constants";
import { useAuthStore, type AuthStore } from "@/stores/useAuthStore";

const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

const getAuthState = (): AuthStore => useAuthStore.getState();

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

// 응답 인터셉터: 401 (Unauthorized), 403 (Forbidden: 만료) 에러 시 처리
instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      // 로그아웃 처리
      getAuthState().setLogout();
      window.location.href = PATHS.LOGIN;
    }

    return Promise.reject(error);
  }
);

export default instance;
