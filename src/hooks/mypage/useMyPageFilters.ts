// src/hooks/mypage/useMyPageFilters.ts
import { useMemo } from "react";
import { CaseResult } from "@/components/mypage/TrialListItem";

export const useMyPageFilters = (
  allItems: any[],
  ongoingTrialsWithType: any[],
  defenseListWithResult: any[],
  sortType: CaseResult | '정렬',
  defenseSortType: '정렬' | 'WIN' | 'LOSE' | 'PENDING' | 'LIKE'
) => {
  // 전체 필터링
  const filteredAllItems = useMemo(() => {
    if (sortType === '정렬') return allItems;
    return allItems.filter(item => 
      item.type === 'ongoing' && (item as any).caseResult === sortType
    );
  }, [allItems, sortType]);

  // 진행중인 재판 필터링
  const filteredOngoingTrials = useMemo(() => {
    if (sortType === '정렬') return ongoingTrialsWithType;
    return ongoingTrialsWithType.filter(trial => trial.caseResult === sortType);
  }, [ongoingTrialsWithType, sortType]);

  // 변호전적 필터링
  const filteredDefenseList = useMemo(() => {
    let list = [...defenseListWithResult];
    
    if (defenseSortType === 'LIKE') {
      return list.sort((a, b) => b.likeCount - a.likeCount);
    }
    
    if (defenseSortType === 'WIN') {
      return list.filter(d => d.caseResult === 'WIN');
    }
    
    if (defenseSortType === 'LOSE') {
      return list.filter(d => d.caseResult === 'LOSE');
    }
    
    if (defenseSortType === 'PENDING') {
      return list.filter(d => d.caseResult === 'PENDING');
    }
    
    return list;
  }, [defenseListWithResult, defenseSortType]);

  return {
    filteredAllItems,
    filteredOngoingTrials,
    filteredDefenseList,
  };
};