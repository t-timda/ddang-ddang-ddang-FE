// src/components/mypage/tabs/ExpTab.tsx
import React, { useState } from "react";
import { getRankNicknameFrame } from "@/utils/rankImageMapper";
import ChevronUpIcon from "@/assets/icons/ChevronUpIcon";
import Pagination from "@/components/vs-mode/Pagination";
import { useUserExpHistoryQuery } from "@/hooks/api/useUserQuery";

interface ExpTabProps {
  currentRank: string;
  currentExp: number;
  nickname?: string;
}

// 백엔드 ENUM과 동일한 칭호 데이터
const rankData = [
  { name: '파트너 변호사', minExp: 8500 },
  { name: '시니어 변호사', minExp: 6500 },
  { name: '중견 변호사', minExp: 5000 },
  { name: '신입 변호사', minExp: 4100 },
  { name: '로스쿨 졸업반', minExp: 3650 },
  { name: '로스쿨 2학년', minExp: 3000 },
  { name: '로스쿨 1학년', minExp: 2400 },
  { name: '법대생 졸업반', minExp: 1900 },
  { name: '법대생 3학년', minExp: 1400 },
  { name: '법대생 2학년', minExp: 1000 },
  { name: '법대생 1학년', minExp: 700 },
  { name: '말싸움 고수', minExp: 500 },
  { name: '말싸움 중수', minExp: 250 },
  { name: '말싸움 하수', minExp: 100 },
  { name: '말싸움 풋내기', minExp: 0 },
];

// 칭호 단계 데이터
const rankCategories = [
  {
    category: '말싸움',
    ranks: [
      '말싸움 풋내기',
      '말싸움 하수',
      '말싸움 중수',
      '말싸움 고수',
    ]
  },
  {
    category: '법대생',
    ranks: [
      '법대생 1학년',
      '법대생 2학년',
      '법대생 3학년',
      '법대생 졸업반',
    ]
  },
  {
    category: '로스쿨',
    ranks: [
      '로스쿨 1학년',
      '로스쿨 2학년',
      '로스쿨 졸업반',
    ]
  },
  {
    category: '변호사',
    ranks: [
      '신입 변호사',
      '중견 변호사',
      '시니어 변호사',
      '파트너 변호사',
    ]
  },
];

export const ExpTab: React.FC<ExpTabProps> = ({ currentRank, currentExp, nickname }) => {
  const nicknameFrameImage = getRankNicknameFrame(currentRank);
  const [showExpHistory, setShowExpHistory] = useState(false);
  const [historyPage, setHistoryPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // 경험치 내역 조회
  const { data: expHistoryData, isLoading: isExpHistoryLoading } = useUserExpHistoryQuery({ enabled: showExpHistory });
  const expHistory = expHistoryData?.result ?? [];

  // 파트너 변호사는 흰색 텍스트
  const isPartnerLawyer = currentRank === "파트너 변호사";
  const currentRankTextColor = isPartnerLawyer ? "text-white" : "text-main";

  // 현재 칭호의 경험치 범위 계산
  const currentRankIndex = rankData.findIndex(r => r.name === currentRank);
  const currentRankData = rankData[currentRankIndex];
  const nextRankData = currentRankIndex > 0 ? rankData[currentRankIndex - 1] : null;
  
  // 현재 칭호 구간의 시작값과 끝값
  const rangeStart = currentRankData?.minExp || 0;
  const rangeEnd = nextRankData?.minExp || rangeStart + 2000; // 다음 칭호가 없으면 +2000
  const rangeTotal = rangeEnd - rangeStart;
  
  // 현재 구간에서의 진행도
  const progressInRange = currentExp - rangeStart;
  const progressPercentage = !nextRankData ? 100 : Math.min((progressInRange / rangeTotal) * 100, 100);

  // 페이지네이션 - 실제 API 데이터 사용
  const totalPages = Math.ceil(expHistory.length / ITEMS_PER_PAGE);
  const startIndex = (historyPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedHistory = expHistory.slice(startIndex, endIndex);

  return (
    <div className="pt-4">
      <h3 className="text-xl md:text-2xl font-bold text-main mb-4 md:mb-6">현재 칭호</h3>
      
      {/* 명패 이미지 위에 텍스트 오버레이 */}
      <div className="relative w-32 md:w-40 mb-6 md:mb-8">
        <img 
          src={nicknameFrameImage} 
          alt="칭호 명패" 
          className="w-full h-auto"
        />
        {/* 텍스트 오버레이 - 칭호 닉네임 순서로 한 줄에 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <p className={`${currentRankTextColor} font-bold text-[10px] md:text-xs`}>
            {currentRank} {nickname || "닉네임"}
          </p>
        </div>
      </div>

      <p className="text-lg md:text-xl font-bold text-main mb-3 md:mb-4">
        현재 경험치: <span className="text-main">{currentExp}</span>
      </p>
      
      {/* 경험치 바 */}
      <div className="mb-2">
        <div className="w-full bg-gray-200 rounded-full h-3 md:h-4 relative overflow-hidden">
          <div 
            className={`h-3 md:h-4 rounded-full transition-all duration-500 ${
              !nextRankData 
                ? 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 animate-pulse' 
                : 'bg-main'
            }`}
            style={{ width: `${progressPercentage}%` }} 
          />
        </div>
        {/* 시작값과 끝값 표시 */}
        <div className="flex justify-between text-xs md:text-sm text-gray-600 mt-1">
          <span>{rangeStart}</span>
          <span>{rangeEnd}</span>
        </div>
      </div>

      {nextRankData ? (
        <p className="text-sm md:text-base text-gray-600 mb-3">
          다음 칭호 <span className="font-bold text-main">{nextRankData.name}</span>까지{' '}
          <span className="font-bold text-main">{rangeEnd - currentExp}</span> 경험치 필요
        </p>
      ) : (
        <p className="text-sm md:text-base text-yellow-600 font-bold mb-3">
          🏆 최고 칭호 달성! 축하합니다!
        </p>
      )}

      {/* 경험치 획득 내역 */}
      <div className="mb-6 md:mb-8">
        <button
          onClick={() => setShowExpHistory(!showExpHistory)}
          className="flex items-center gap-2 text-main text-sm md:text-base cursor-pointer"
        >
          <span>경험치 획득 내역 {showExpHistory ? '접기' : '펼쳐보기'}</span>
          <ChevronUpIcon 
            className={`w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 ${
              showExpHistory ? '' : 'rotate-180'
            }`}
          />
        </button>

        {showExpHistory && (
          <div className="mt-4">
            {isExpHistoryLoading ? (
              <div className="bg-main-bright rounded-lg p-4 text-center text-gray-500">
                로딩 중...
              </div>
            ) : expHistory.length > 0 ? (
              <div className="bg-main-bright rounded-lg p-4">
                <div className="space-y-2">
                  {paginatedHistory.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
                    >
                      <div className="flex-1">
                        <p className="text-main font-medium">{item.description}</p>
                        <p className="text-xs text-gray-500">{item.createdAt}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-main font-bold">+{item.amount} EXP</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 페이지네이션 */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={historyPage}
                    totalPages={totalPages}
                    onPageChange={setHistoryPage}
                  />
                )}
              </div>
            ) : (
              <div className="bg-main-bright rounded-lg p-4 text-center text-gray-500">
                경험치 획득 내역이 없습니다.
              </div>
            )}
          </div>
        )}
      </div>

      {/* 칭호 단계 */}
      <div className="mb-6">
        <h4 className="text-lg md:text-xl font-bold text-main mb-4">칭호 단계</h4>
        <div className="space-y-6">
          {rankCategories.map((categoryData) => (
            <div key={categoryData.category}>
              <p className="text-sm md:text-base font-semibold text-main mb-3">{categoryData.category}</p>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {categoryData.ranks.map((rankName) => {
                  const isActive = rankName === currentRank;
                  const frameImage = getRankNicknameFrame(rankName);
                  const isPartner = rankName === "파트너 변호사";
                  const textColor = isPartner ? "text-white" : "text-main";
                  
                  return (
                    <div 
                      key={rankName} 
                      className="flex-shrink-0 p-2"
                    >
                      <div 
                        className={`relative w-20 md:w-24 transition-all ${
                          isActive ? 'scale-110 opacity-100' : 'opacity-50'
                        }`}
                      >
                        <img 
                          src={frameImage} 
                          alt={rankName}
                          className="w-full h-auto"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <p className={`${textColor} font-bold text-[8px] md:text-[10px] text-center px-1`}>
                            {rankName}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};