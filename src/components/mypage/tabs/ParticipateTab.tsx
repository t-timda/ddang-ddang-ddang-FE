// src/components/mypage/tabs/ParticipateTab.tsx
import React, { useMemo } from "react";
import { CaseResult } from "@/components/mypage/TrialListItem";
import TrialListItem from "@/components/mypage/TrialListItem";
import DefenseListItem from "@/components/mypage/DefenseListItem";
import Pagination from "@/components/vs-mode/Pagination";

interface ParticipateTabProps {
  participateTab: "전체" | "재판전적" | "진행중" | "변호전적";
  setParticipateTab: (tab: "전체" | "재판전적" | "진행중" | "변호전적") => void;
  sortType: CaseResult | '정렬';
  setSortType: (type: CaseResult | '정렬') => void;
  defenseSortType: '정렬' | '전체' | 'WIN' | 'LOSE' | 'PENDING' | 'LIKE';
  setDefenseSortType: (type: '정렬' | '전체' | 'WIN' | 'LOSE' | 'PENDING' | 'LIKE') => void;
  allItems: any[];
  paginatedAllItems: any[];
  allPage: number;
  allTotalPages: number;
  setAllPage: (page: number) => void;
  trialItems: any[]; // 나의 재판 전적
  paginatedTrialItems: any[];
  trialPage: number;
  trialTotalPages: number;
  setTrialPage: (page: number) => void;
  filteredOngoingTrials: any[];
  paginatedOngoingTrials: any[];
  ongoingPage: number;
  ongoingTotalPages: number;
  setOngoingPage: (page: number) => void;
  filteredDefenseList: any[];
  paginatedDefenseList: any[];
  defensePage: number;
  defenseTotalPages: number;
  setDefensePage: (page: number) => void;
}

export const ParticipateTab: React.FC<ParticipateTabProps> = ({
  participateTab,
  setParticipateTab,
  sortType,
  setSortType,
  defenseSortType,
  setDefenseSortType,
  allItems,
  paginatedAllItems,
  allPage,
  allTotalPages,
  setAllPage,
  trialItems,
  paginatedTrialItems,
  trialPage,
  trialTotalPages,
  setTrialPage,
  filteredOngoingTrials,
  paginatedOngoingTrials,
  ongoingPage,
  ongoingTotalPages,
  setOngoingPage,
  filteredDefenseList,
  paginatedDefenseList,
  defensePage,
  defenseTotalPages,
  setDefensePage,
}) => {
  // 정렬 옵션에 SOLO(완료) 추가
  const SORT_OPTIONS = [
    { value: "정렬", label: "정렬" },
    { value: "WIN", label: "승리" },
    { value: "LOSE", label: "패배" },
    { value: "SOLO", label: "완료" },
    { value: "PENDING", label: "진행중" },
  ];

  const sortedAllItems = useMemo(() => {
    // 정렬 로직 (예: 승리, 패배, 진행중, 완료 순)
    const sortOrder: Record<string, number> = {
      WIN: 1,
      LOSE: 2,
      PENDING: 3,
      ONGOING: 3,
      SOLO: 4,
      "전체": 5,
    };
    return [...allItems].sort((a, b) => {
      return (sortOrder[a.caseResult] || 5) - (sortOrder[b.caseResult] || 5);
    });
  }, [allItems]);

  
  // 전체 탭에서의 필터링된 아이템
  const filteredAllItems = useMemo(() => {
    if (sortType === "정렬") return sortedAllItems;
    return sortedAllItems.filter(item => item.caseResult === sortType);
  }, [sortedAllItems, sortType]);

  return (
    <div className="pt-4">
      <h3 className="text-xl md:text-2xl font-bold text-main mb-4 md:mb-6">참여한 재판 목록</h3>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 md:mb-6 border-b border-gray-300 pb-2">
        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto">
          <button
            className={`px-3 md:px-4 py-2 font-semibold transition-colors text-sm md:text-base whitespace-nowrap ${
              participateTab === "전체"
                ? "text-main border-b-2 border-main"
                : "text-gray-500 hover:text-main"
            }`}
            onClick={() => setParticipateTab("전체")}
          >
            전체
          </button>
          <button
            className={`px-3 md:px-4 py-2 font-semibold transition-colors text-sm md:text-base whitespace-nowrap ${
              participateTab === "재판전적"
                ? "text-main border-b-2 border-main"
                : "text-gray-500 hover:text-main"
            }`}
            onClick={() => setParticipateTab("재판전적")}
          >
            나의 재판 전적
          </button>
          <button
            className={`px-3 md:px-4 py-2 font-semibold transition-colors text-sm md:text-base whitespace-nowrap ${
              participateTab === "진행중"
                ? "text-main border-b-2 border-main"
                : "text-gray-500 hover:text-main"
            }`}
            onClick={() => setParticipateTab("진행중")}
          >
            진행중인 재판
          </button>
          <button
            className={`px-3 md:px-4 py-2 font-semibold transition-colors text-sm md:text-base whitespace-nowrap ${
              participateTab === "변호전적"
                ? "text-main border-b-2 border-main"
                : "text-gray-500 hover:text-main"
            }`}
            onClick={() => setParticipateTab("변호전적")}
          >
            나의 변호 전적
          </button>
        </div>

        {participateTab === "전체" && (
          <select 
            value={sortType} 
            onChange={(e) => setSortType(e.target.value as CaseResult | '정렬')} 
            className="p-2 rounded-md bg-main-bright text-main-medium cursor-pointer text-sm md:text-base w-full sm:w-auto"
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        )}
        
        {participateTab === "진행중" && (
          <select 
            value={sortType} 
            onChange={(e) => setSortType(e.target.value as CaseResult | '정렬')} 
            className="p-2 rounded-md bg-main-bright text-main-medium cursor-pointer text-sm md:text-base w-full sm:w-auto"
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        )}

        {participateTab === "변호전적" && (
          <select 
            value={defenseSortType} 
            onChange={(e) => setDefenseSortType(e.target.value as '전체' | 'WIN' | 'LOSE' | 'PENDING' | 'LIKE')} 
            className="p-2 rounded-md bg-main-bright text-main-medium cursor-pointer text-sm md:text-base w-full sm:w-auto"
          >
            <option value="전체">전체</option>
            <option value="LIKE">좋아요순</option>
            <option value="WIN">승리한 재판</option>
            <option value="LOSE">패배한 재판</option>
            <option value="PENDING">진행중인 재판</option>
          </select>
        )}
      </div>

      {participateTab === "전체" && (
        <>
          <div className="mb-3 md:mb-4">
            <span className="text-base md:text-lg text-main">({allItems.length}개 항목)</span>
          </div>
          <div className="space-y-3 md:space-y-4">
            {paginatedAllItems.length > 0 ? (
              <>
                {filteredAllItems.slice((allPage - 1) * 10, allPage * 10).map((item, idx) => (
                  <div key={`all-${idx}`}>
                    <p className="text-xs md:text-sm text-main mb-2">
                      {item.type === 'trial'
                        ? `내가 생성한 재판`
                        : item.type === 'ongoing'
                        ? `내가 진행중인 재판`
                        : '나의 변호 전적'
                      }
                    </p>
                    {item.type === 'trial' || item.type === 'ongoing' ? (
                      <TrialListItem trial={item as any} />
                    ) : (
                      <DefenseListItem defense={item as any} />
                    )}
                  </div>
                ))}
                {allTotalPages > 1 && (
                  <Pagination
                    currentPage={allPage}
                    totalPages={allTotalPages}
                    onPageChange={setAllPage}
                  />
                )}
              </>
            ) : (
              <div className="text-center py-8 md:py-10 text-gray-500 bg-gray-50 rounded-lg text-sm md:text-base">
                참여한 내역이 없습니다.
              </div>
            )}
          </div>
        </>
      )}

      {participateTab === "재판전적" && (
        <>
          <div className="mb-3 md:mb-4">
            <span className="text-base md:text-lg text-main">({trialItems.length}개의 재판)</span>
          </div>
          <div className="space-y-3 md:space-y-4">
            {paginatedTrialItems.length > 0 ? (
              <>
                {paginatedTrialItems.map((trial, idx) => (
                  <div key={`trial-${idx}`}>
                    <p className="text-xs md:text-sm text-main mb-2">
                      내가 생성한 재판
                    </p>
                    <TrialListItem trial={trial} />
                  </div>
                ))}
                {trialTotalPages > 1 && (
                  <Pagination
                    currentPage={trialPage}
                    totalPages={trialTotalPages}
                    onPageChange={setTrialPage}
                  />
                )}
              </>
            ) : (
              <div className="text-center py-8 md:py-10 text-gray-500 bg-gray-50 rounded-lg text-sm md:text-base">
                생성한 재판이 없습니다.
              </div>
            )}
          </div>
        </>
      )}

      {participateTab === "진행중" && (
        <>
          <div className="mb-3 md:mb-4">
            <span className="text-base md:text-lg text-main">({filteredOngoingTrials.length}개의 재판)</span>
          </div>
          <div className="space-y-3 md:space-y-4">
            {paginatedOngoingTrials.length > 0 ? (
              <>
                {paginatedOngoingTrials.map((trial, idx) => (
                  <div key={`ongoing-${idx}`}>
                    <p className="text-xs md:text-sm text-main mb-2">
                      내가 진행중인 재판
                    </p>
                    <TrialListItem trial={trial} />
                  </div>
                ))}
                {ongoingTotalPages > 1 && (
                  <Pagination
                    currentPage={ongoingPage}
                    totalPages={ongoingTotalPages}
                    onPageChange={setOngoingPage}
                  />
                )}
              </>
            ) : (
              <div className="text-center py-8 md:py-10 text-gray-500 bg-gray-50 rounded-lg text-sm md:text-base">
                진행중인 재판이 없습니다.
              </div>
            )}
          </div>
        </>
      )}

      {participateTab === "변호전적" && (
        <>
          <div className="mb-3 md:mb-4">
            <span className="text-base md:text-lg text-main">({filteredDefenseList.length}개의 변론/반론)</span>
          </div>
          <div className="space-y-3 md:space-y-4">
            {paginatedDefenseList.length > 0 ? (
              <>
                {paginatedDefenseList.map((defense, idx) => (
                  <div key={`defense-${idx}`}>
                    <p className="text-xs md:text-sm text-main mb-2">나의 변호 전적</p>
                    <DefenseListItem defense={defense} />
                  </div>
                ))}
                {defenseTotalPages > 1 && (
                  <Pagination
                    currentPage={defensePage}
                    totalPages={defenseTotalPages}
                    onPageChange={setDefensePage}
                  />
                )}
              </>
            ) : (
              <div className="text-center py-8 md:py-10 text-gray-500 bg-gray-50 rounded-lg text-sm md:text-base">
                작성한 변론이 없습니다.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};