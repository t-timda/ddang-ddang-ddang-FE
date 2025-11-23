import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { thirdTrialApi } from "@/apis/thirdTrial/thirdTrialApi";
import { adoptApi } from "@/apis/adopt/adoptApi";
import type { ThirdTrialStartRequest } from "@/types/apis/thirdTrial";
import type { AdoptRequestDto } from "@/types/apis/adopt";

// 3차 재판 시작 훅
export const useStartThirdTrialMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: ThirdTrialStartRequest) =>
      thirdTrialApi.postThirdTrialStart(body),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["third-trial", "case", variables.caseId],
      });
    },
  });
};

// 3차 재판 상세 조회 훅
export const useThirdCaseDetailQuery = (caseId?: number) =>
  useQuery({
    queryKey: ["third-trial", "case", caseId],
    queryFn: () => thirdTrialApi.getThirdTrialDetail(caseId as number),
    enabled: !!caseId,
  });

// 3차 재판 판결 조회 훅
export const useThirdJudgmentQuery = (
  caseId?: number,
  refetchInterval?: number
) =>
  useQuery({
    queryKey: ["third-trial", "case", caseId, "judgment"],
    queryFn: () => thirdTrialApi.getThirdTrialJudgment(caseId as number),
    enabled: !!caseId,
    refetchInterval,
  });

// 3차 재판 상태 완료 처리 훅
export const usePatchThirdCaseDone = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ caseId }: { caseId: number }) =>
      thirdTrialApi.patchThirdTrialStatus(caseId, { status: "DONE" }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["third-trial", "case", variables.caseId],
      });
    },
  });
};

// ==================== Adopt API Hooks ====================

// 채택된 변론/반론 조회 훅
export const useAdoptedItemsQuery = (caseId?: number) =>
  useQuery({
    queryKey: ["adopt", "case", caseId],
    queryFn: () => adoptApi.getAdoptedItems(caseId as number),
    enabled: !!caseId,
  });

// 수동 채택 훅
export const useAdoptItemsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ caseId, body }: { caseId: number; body: AdoptRequestDto }) =>
      adoptApi.postAdoptItems(caseId, body),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["adopt", "case", variables.caseId],
      });
    },
  });
};

// 최종심으로 사건 상태 변경 훅 (3차 재판 시작)
export const useChangeToThirdTrialMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (caseId: number) => adoptApi.postStartThirdTrial(caseId),
    onSuccess: (_data, caseId) => {
      queryClient.invalidateQueries({
        queryKey: ["adopt", "case", caseId],
      });
      queryClient.invalidateQueries({
        queryKey: ["third-trial", "case", caseId],
      });
    },
  });
};

// 자동 채택 훅
export const useAutoAdoptMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (caseId: number) => adoptApi.postAutoAdopt(caseId),
    onSuccess: (_data, caseId) => {
      queryClient.invalidateQueries({
        queryKey: ["adopt", "case", caseId],
      });
    },
  });
};

// 좋아요 많은 순으로 변론/반론 조회 훅
export const useBestAdoptItemsQuery = (caseId?: number) =>
  useQuery({
    queryKey: ["adopt", "best", caseId],
    queryFn: () => adoptApi.getBestAdoptItems(caseId as number),
    enabled: !!caseId,
  });

// 최종 판결 상태 조회 훅
export const useJudgeStatusQuery = (caseId?: number) =>
  useQuery({
    queryKey: ["third-trial", "judge-status", caseId],
    queryFn: () => thirdTrialApi.getJudgeStatus(caseId as number),
    enabled: !!caseId,
  });

// 최종 판결 생성 훅
export const useCreateJudgmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (caseId: number) => thirdTrialApi.postCreateJudgment(caseId),
    onSuccess: (_data, caseId) => {
      queryClient.invalidateQueries({
        queryKey: ["third-trial", "judgment", caseId],
      });
      queryClient.invalidateQueries({
        queryKey: ["third-trial", "judge-status", caseId],
      });
    },
  });
};
