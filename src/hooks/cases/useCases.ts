import { useQuery } from "@tanstack/react-query";
import { casesApi } from "@/apis/cases/casesApi";

// 진행중인 재판 목록 조회 훅
export const useOngoingCasesQuery = () =>
  useQuery({
    queryKey: ["cases", "ongoing"],
    queryFn: () => casesApi.getOngoingCases(),
  });

// 특정 케이스의 최종 판결 히스토리 조회 훅
export const useFinalJudgmentHistoryQuery = (caseId: number) =>
  useQuery({
    queryKey: ["cases", "judgment-history", caseId],
    queryFn: () => casesApi.getFinalJudgmentHistory(caseId),
    enabled: !!caseId,
  });

// 완료된 재판 목록 조회 훅
export const useFinishedCasesQuery = () =>
  useQuery({
    queryKey: ["cases", "finished"],
    queryFn: () => casesApi.getFinishedCases(),
  });
