import { useQuery } from "@tanstack/react-query";
import { homeApi } from "@/apis/home/meApi";

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
