import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { authApi } from "@/apis/auth/authApi";
import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  TokenRefreshRequest,
  TokenRefreshResponse,
  SendEmailCodeRequest,
  VerifyEmailCodeRequest,
} from "@/types/apis/auth";

type MutationOptions<TData, TVariables> = UseMutationOptions<
  TData,
  Error,
  TVariables
>;

export const useSendEmailCodeMutation = () =>
  useMutation({
    mutationFn: (body: SendEmailCodeRequest) => authApi.postSendEmailCode(body),
  });

export const useVerifyEmailCodeMutation = () =>
  useMutation({
    mutationFn: (body: VerifyEmailCodeRequest) =>
      authApi.postVerifyEmailCode(body),
  });

export const usePostSignupMutation = (
  options?: MutationOptions<SignupResponse, SignupRequest>
) =>
  useMutation({
    mutationFn: authApi.postSignup,
    ...options,
  });

export const usePostLoginMutation = (
  options?: MutationOptions<LoginResponse, LoginRequest>
) =>
  useMutation({
    mutationFn: authApi.postLogin,
    ...options,
  });

export const usePostTokenRefreshMutation = (
  options?: MutationOptions<TokenRefreshResponse, TokenRefreshRequest>
) =>
  useMutation({
    mutationFn: authApi.postTokenRefresh,
    ...options,
  });
