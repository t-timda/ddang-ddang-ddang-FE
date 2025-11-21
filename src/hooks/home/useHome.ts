import { useQuery, useQueries } from "@tanstack/react-query";
import { homeApi } from "@/apis/home/meApi";
import instance from "@/apis/instance";

// 로그인 필요
export const useMyDefensesQuery = (enabled = true) =>
  useQuery({
    queryKey: ["home", "myDefenses"],
    queryFn: homeApi.getMyDefenses,
    enabled,
  });

export const useMyOngoingCasesQuery = (enabled = true) =>
  useQuery({
    queryKey: ["home", "myOngoingCases"],
    queryFn: homeApi.getMyOngoingCases,
    enabled,
  });

// 공개
export const useHotCasesQuery = () =>
  useQuery({
    queryKey: ["home", "hot"],
    queryFn: homeApi.getHotCases,
  });

// 여러 재판 정보를 한번에 가져오는 훅
export const useCasesResultsQuery = (caseIds: number[]) => {
  return useQueries({
    queries: caseIds.map(caseId => ({
      queryKey: ['caseResult', caseId],
      queryFn: async () => {
        const { data } = await instance.get(`/api/v1/cases/${caseId}`);
        return { 
          caseId, 
          caseResult: data.result?.caseResult || 'PENDING',
          status: data.result?.status 
        };
      },
    })),
  });
};
