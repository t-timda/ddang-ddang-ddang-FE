// src/hooks/mypage/useMyPageData.ts
import { useState, useEffect, useMemo } from "react";
import { CaseResult, TrialData } from "@/components/mypage/TrialListItem";
import { 
  useUserProfileQuery, 
  useUserRecordQuery, 
  useUserAchievementsQuery, 
  useUserRankQuery, 
  useUserCasesQuery 
} from "@/hooks/api/useUserQuery";
import { 
  useMyDefensesQuery, 
  useMyOngoingCasesQuery, 
  useCasesResultsQuery 
} from "@/hooks/home/useHome";

export const useMyPageData = (isAuthenticated: boolean) => {
  // 데이터 쿼리
  const { data: userData, isLoading, isError, error } = useUserProfileQuery({
    enabled: isAuthenticated,
  });
  const { data: recordData } = useUserRecordQuery({ enabled: isAuthenticated });
  const { data: achievementsData } = useUserAchievementsQuery({ enabled: isAuthenticated });
  const { data: rankData } = useUserRankQuery({ enabled: isAuthenticated });
  const { data: casesData } = useUserCasesQuery({ enabled: isAuthenticated });
  const { data: ongoingCasesData } = useMyOngoingCasesQuery(isAuthenticated);
  const { data: defensesData } = useMyDefensesQuery(isAuthenticated);

  // 화면 크기 감지
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // 계산된 값들
  const wins = recordData?.result?.winCnt ?? 0;
  const losses = recordData?.result?.loseCnt ?? 0;
  const currentRank = rankData?.result?.rank ?? "로딩 중...";
  const currentExp = rankData?.result?.exp ?? 0;

  // 내가 생성한 재판 목록
  const trialListData: TrialData[] = useMemo(() => {
    return casesData?.result?.map(caseItem => ({
      id: caseItem.caseId,
      title: caseItem.title,
      mySide: caseItem.mainArguments[0] || "",
      status: caseItem.status,
      caseResult: caseItem.caseResult,
    })) ?? [];
  }, [casesData]);

  // 진행중인 재판 목록
  const ongoingTrialsWithType: Array<TrialData & { type: 'ongoing', mode?: string }> = useMemo(() => {
    return ongoingCasesData?.result?.map(caseItem => ({
      id: caseItem.caseId,
      title: caseItem.title,
      mySide: caseItem.mainArguments[0] || "",
      status: caseItem.status,
      caseResult: "PENDING" as CaseResult,
      type: 'ongoing' as const,
      mode: '솔로모드',
    })) ?? [];
  }, [ongoingCasesData]);

  // 변호 전적
  const defenseListWithType = useMemo(() => {
    const defenses = defensesData?.result?.defenses ?? [];
    const rebuttals = defensesData?.result?.rebuttals ?? [];
    return [...defenses, ...rebuttals].map(d => ({ ...d, type: 'defense' as const }));
  }, [defensesData]);

  // 변호 전적의 모든 caseId 추출
  const defenseCaseIds = useMemo(() => {
    return [...new Set(defenseListWithType.map(d => d.caseId))];
  }, [defenseListWithType]);

  // 각 재판의 결과 가져오기
  const caseResultsQueries = useCasesResultsQuery(defenseCaseIds);

  // caseId -> caseResult 매핑
  const caseResultsMap = useMemo(() => {
    const map = new Map<number, { caseResult: CaseResult; status: string }>();
    caseResultsQueries.forEach((query) => {
      if (query.data) {
        map.set(query.data.caseId, {
          caseResult: query.data.caseResult as CaseResult,
          status: query.data.status
        });
      }
    });
    return map;
  }, [caseResultsQueries]);

  // 변호 전적에 재판 결과 추가
  const defenseListWithResult = useMemo(() => {
    return defenseListWithType.map(defense => ({
      ...defense,
      caseResult: caseResultsMap.get(defense.caseId)?.caseResult || 'PENDING' as CaseResult,
      caseStatus: caseResultsMap.get(defense.caseId)?.status || 'PENDING'
    }));
  }, [defenseListWithType, caseResultsMap]);

  // 전체: 진행중인 재판 + 변호전적 합치기
  const allItems = useMemo(() => {
    return [...ongoingTrialsWithType, ...defenseListWithType];
  }, [ongoingTrialsWithType, defenseListWithType]);

  return {
    userData,
    isLoading,
    isError,
    error,
    wins,
    losses,
    currentRank,
    currentExp,
    achievementsData,
    trialListData,
    ongoingTrialsWithType,
    defenseListWithResult,
    allItems,
    isLargeScreen,
  };
};