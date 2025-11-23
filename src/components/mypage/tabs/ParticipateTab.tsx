// src/components/mypage/tabs/ParticipateTab.tsx
import React from "react";
import { CaseResult } from "@/components/mypage/TrialListItem";
import TrialListItem from "@/components/mypage/TrialListItem";
import DefenseListItem from "@/components/mypage/DefenseListItem";
import Pagination from "@/components/vs-mode/Pagination";

interface ParticipateTabProps {
  participateTab: "전체" | "진행중" | "변호전적";
  setParticipateTab: (tab: "전체" | "진행중" | "변호전적") => void;
  sortType: CaseResult | '정렬';
  setSortType: (type: CaseResult | '정렬') => void;
  defenseSortType: '정렬' | 'WIN' | 'LOSE' | 'PENDING' | 'LIKE';
  setDefenseSortType: (type: '정렬' | 'WIN' | 'LOSE' | 'PENDING' | 'LIKE') => void;
  allItems: any[];
  paginatedAllItems: any[];
  allPage: number;
  allTotalPages: number;
  setAllPage: (page: number) => void;
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
              participateTab === "진행중"
                ? "text-main border-b-2 border-main"
                : "text-gray-500 hover:text-main"
            }`}
            onClick={() => setParticipateTab("진행중")}
          >
            내가 진행중인 재판
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
            <option value="정렬">정렬</option>
            <option value="WIN">승리</option>
            <option value="LOSE">패배</option>
            <option value="PENDING">진행중</option>
          </select>
        )}
        
        {participateTab === "진행중" && (
          <select 
            value={sortType} 
            onChange={(e) => setSortType(e.target.value as CaseResult | '정렬')} 
            className="p-2 rounded-md bg-main-bright text-main-medium cursor-pointer text-sm md:text-base w-full sm:w-auto"
          >
            <option value="정렬">정렬</option>
            <option value="WIN">승리</option>
            <option value="LOSE">패배</option>
            <option value="PENDING">진행중</option>
          </select>
        )}

        {participateTab === "변호전적" && (
          <select 
            value={defenseSortType} 
            onChange={(e) => setDefenseSortType(e.target.value as '정렬' | 'WIN' | 'LOSE' | 'PENDING' | 'LIKE')} 
            className="p-2 rounded-md bg-main-bright text-main-medium cursor-pointer text-sm md:text-base w-full sm:w-auto"
          >
            <option value="정렬">정렬</option>
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
                {paginatedAllItems.map((item, idx) => (
                  <div key={`all-${idx}`}>
                    <p className="text-xs md:text-sm text-main mb-2">
                      {item.type === 'ongoing' 
                        ? `내가 진행중인 재판 - ${(item as any).mode || '솔로모드'}`
                        : '나의 변호 전적'
                      }
                    </p>
                    {item.type === 'ongoing' ? (
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
                      내가 진행중인 재판 - {trial.mode || '솔로모드'}
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