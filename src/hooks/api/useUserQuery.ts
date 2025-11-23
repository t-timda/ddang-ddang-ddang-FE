import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/apis/user/userApi';
import type { 
  UserUpdateRequest, 
  UserProfileData,
  UserRecordResponse,
  UserAchievementsResponse,
  UserRankResponse,
  UserCasesResponse,
  UserProfileImageResponse,
  UserExpHistoryResponse
} from '@/types/apis/user';

// My Page: 사용자 프로필 정보를 가져오는 훅
export const useUserProfileQuery = (options?: { enabled?: boolean }) => {
    return useQuery<UserProfileData, Error>({
        queryKey: ['userProfile'],
        queryFn: async () => {
            const response = await userApi.getProfile();
            if (!response.isSuccess || !response.result) { 
                throw new Error(response.message || '사용자 프로필 정보를 불러오지 못했습니다.');
            }
            return response.result as UserProfileData;
        },
        enabled: options?.enabled,
    });
};

// My Page: 사용자 전적 정보를 가져오는 훅
export const useUserRecordQuery = (options?: { enabled?: boolean }) => {
    return useQuery<UserRecordResponse, Error>({
        queryKey: ['userRecord'],
        queryFn: async () => {
            const response = await userApi.getUserRecord();
            if (!response.isSuccess || !response.result) {
                throw new Error(response.message || '전적 정보를 불러오지 못했습니다.');
            }
            return response;
        },
        enabled: options?.enabled,
    });
};

// My Page: 사용자 업적 정보를 가져오는 훅
export const useUserAchievementsQuery = (options?: { enabled?: boolean }) => {
    return useQuery<UserAchievementsResponse, Error>({
        queryKey: ['userAchievements'],
        queryFn: async () => {
            const response = await userApi.getUserAchievements();
            if (!response.isSuccess || !response.result) {
                throw new Error(response.message || '업적 정보를 불러오지 못했습니다.');
            }
            return response;
        },
        enabled: options?.enabled,
    });
};

// My Page: 사용자 등급/칭호 정보를 가져오는 훅
export const useUserRankQuery = (options?: { enabled?: boolean }) => {
    return useQuery<UserRankResponse, Error>({
        queryKey: ['userRank'],
        queryFn: async () => {
            const response = await userApi.getUserRank();
            if (!response.isSuccess || !response.result) {
                throw new Error(response.message || '등급 정보를 불러오지 못했습니다.');
            }
            return response;
        },
        enabled: options?.enabled,
    });
};

// My Page: 사용자 참여 사건 정보를 가져오는 훅
export const useUserCasesQuery = (options?: { enabled?: boolean }) => {
    return useQuery<UserCasesResponse, Error>({
        queryKey: ['userCases'],
        queryFn: async () => {
            const response = await userApi.getUserCases();
            if (!response.isSuccess || !response.result) {
                throw new Error(response.message || '사건 정보를 불러오지 못했습니다.');
            }
            return response;
        },
        enabled: options?.enabled,
    });
};

// My Page: 사용자 경험치 내역을 가져오는 훅
export const useUserExpHistoryQuery = (options?: { enabled?: boolean }) => {
    return useQuery<UserExpHistoryResponse, Error>({
        queryKey: ['userExpHistory'],
        queryFn: async () => {
            const response = await userApi.getExpHistory();
            if (!response.isSuccess || !response.result) {
                throw new Error(response.message || '경험치 내역을 불러오지 못했습니다.');
            }
            return response;
        },
        enabled: options?.enabled,
    });
};

// My Page: 사용자 정보를 업데이트하는 훅
export const useUpdateUserProfileMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: UserUpdateRequest) => {
            const response = await userApi.updateProfile(payload);
            if (!response.isSuccess) {
                throw new Error(response.message || '정보 수정에 실패했습니다.');
            }
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        },
    });
};

// My Page: 프로필 사진을 업로드하는 훅
export const useUploadProfileImageMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (file: File) => {
            const response = await userApi.uploadProfileImage(file);
            if (!response.isSuccess) {
                throw new Error(response.message || '프로필 사진 업로드에 실패했습니다.');
            }
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        },
    });
};

