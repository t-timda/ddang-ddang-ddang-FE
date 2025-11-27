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
  useMyOngoingCasesQuery
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
  const trialListData = useMemo(() => {
    return casesData?.result?.map(caseItem => ({
      id: caseItem.caseId,
      title: caseItem.title,
      mySide: caseItem.mainArguments[0] || "",
      status: caseItem.status,
      caseResult: caseItem.caseResult,
      mode: caseItem.caseResult === "SOLO" ? "SOLO" as const : undefined,
      type: 'trial' as const, // type 속성 추가
    })) ?? [];
  }, [casesData]);

  // 진행중인 재판 목록
  const ongoingTrialsWithType: Array<TrialData & { type: 'ongoing', mode?: "SOLO" | "PARTY" }> = useMemo(() => {
    return ongoingCasesData?.result?.map(caseItem => ({
      id: caseItem.caseId,
      title: caseItem.title,
      mySide: caseItem.mainArguments[0] || "",
      status: caseItem.status,
      caseResult: caseItem.caseResult,
      type: 'ongoing' as const,
      mode: "SOLO" as const, // API에서 mode 정보가 오면 여기에 매핑
    })) ?? [];
  }, [ongoingCasesData]);

  // 변호 전적 (이제 API 응답에 caseResult가 포함되어 있으므로 추가 호출 불필요)
  const defenseListWithResult = useMemo(() => {
    const defenses = defensesData?.result?.defenses ?? [];
    const rebuttals = defensesData?.result?.rebuttals ?? [];
    return [...defenses, ...rebuttals].map(d => ({
      ...d,
      type: 'defense' as const,
      caseStatus: d.caseResult === 'ONGOING' ? 'SECOND' : 'DONE' // caseResult로부터 status 추론
    }));
  }, [defensesData]);

  // 전체: 내가 만든 재판 + 진행중인 재판 + 변호전적 합치기
  const allItems = useMemo(() => {
    return [
      ...trialListData,           // 내가 만든 재판 목록 추가
      ...ongoingTrialsWithType,   // 진행중인 재판
      ...defenseListWithResult      // 변호전적
    ];
  }, [trialListData, ongoingTrialsWithType, defenseListWithResult]);

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