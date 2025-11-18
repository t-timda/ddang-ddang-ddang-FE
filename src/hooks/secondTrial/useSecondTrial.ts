import { startSecondTrial, getSecondTrialDetails, getDefenses, postDefense, postVote, getVoteResult, postRebuttal, getRebuttals } from "@/apis/secondTrial/secondTrialApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ApiResponse } from "@/types/common/api";
import type { SecondTrialDetailsResponse, DefenseRequest, LikeRequest, VoteRequest, VoteResultResponse, RebuttalRequest, DefenseItem, RebuttalItem } from "@/types/apis/secondTrial";


// 2차 재판 시작 훅
export const useStartSecondTrialMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (caseId: number) => startSecondTrial(caseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['secondTrialDetails'] });
    },
  });
};

// 2차 재판 상세 조회 훅 (object form)
export const useSecondTrialDetailsQuery = (caseId?: number) => {
  return useQuery<ApiResponse<SecondTrialDetailsResponse>, Error>({
    queryKey: ['secondTrialDetails', caseId ?? ''],
    queryFn: async () => {
      if (!caseId) throw new Error("caseId is required");
      return getSecondTrialDetails(caseId);
    },
    enabled: !!caseId,
  });
};

// 변론 제출 훅
export const usePostDefenseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ caseId, body }: { caseId: number; body: DefenseRequest }) =>
      postDefense(caseId, body),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['secondTrialDetails', variables.caseId] });
      queryClient.invalidateQueries({ queryKey: ['defenses', variables.caseId] });
    },
  });
};

// 투표 제출 훅
export const usePostVoteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ caseId, body }: { caseId: number; body: VoteRequest }) =>
      postVote(caseId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["secondTrialDetails"] });
    },
  });
};


// 투표 결과 조회 훅
export const useVoteResultQuery = (caseId?: number) => {
  return useQuery<ApiResponse<VoteResultResponse>, Error>({
    queryKey: ["voteResult", caseId ?? ""],
    queryFn: async () => {
      if (!caseId) throw new Error("caseId is required");
      return getVoteResult(caseId);
    },
    enabled: !!caseId,
  });
};

// 반론 등록 훅
export const usePostRebuttalMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    // body만 받도록 수정 (defenseId는 body 안에 포함)
    mutationFn: (body: RebuttalRequest) => postRebuttal(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["secondTrialDetails"] });
      queryClient.invalidateQueries({ queryKey: ["rebuttals"] });
    },
  });
};

/**
 * 변론 목록 조회 훅
 * 사용 예: const { data, isLoading } = useDefensesQuery(caseId);
 */
export const useDefensesQuery = (caseId?: number) => {
  return useQuery<ApiResponse<DefenseItem[]>, Error>({
    queryKey: ["defenses", caseId ?? ""],
    queryFn: async () => {
      if (!caseId) throw new Error("caseId is required");
      return getDefenses(caseId);
    },
    enabled: !!caseId,
  });
};

/**
 * 반론(대댓글) 목록 조회 훅
 * 사용: const { data, isLoading } = useRebuttalsQuery(defenseId);
 */
export const useRebuttalsQuery = (defenseId?: number) => {
  return useQuery<ApiResponse<RebuttalItem[]>, Error>({
    queryKey: ["rebuttals", defenseId ?? ""],
    queryFn: async () => {
      if (!defenseId) throw new Error("defenseId is required");
      return getRebuttals(defenseId);
    },
    enabled: !!defenseId,
  });
};