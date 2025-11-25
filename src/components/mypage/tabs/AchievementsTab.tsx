// src/components/mypage/tabs/AchievementsTab.tsx
import React from "react";
import MedalIcon from "@/assets/svgs/medalIcon.svg?react";
import Pagination from "@/components/vs-mode/Pagination";

interface Achievement {
  achievementId: number;
  achievementName: string;
  achievementDescription: string;
  achievementIconUrl: string;
  achievementTime: string;
}

interface AchievementsTabProps {
  achievementsData: { result: Achievement[] } | undefined;
  paginatedAchievements: Achievement[];
  achievementPage: number;
  achievementTotalPages: number;
  setAchievementPage: (page: number) => void;
}

export const AchievementsTab: React.FC<AchievementsTabProps> = ({
  achievementsData,
  paginatedAchievements,
  achievementPage,
  achievementTotalPages,
  setAchievementPage,
}) => {
  return (
    <div className="pt-4">
      <h3 className="text-xl md:text-2xl font-bold text-main mb-4 md:mb-6">업적 조회하기</h3>
      {achievementsData?.result && achievementsData.result.length > 0 ? (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-6">
            {paginatedAchievements.map(achievement => (
              <div 
                key={achievement.achievementId} 
                className="flex flex-col items-center"
              >
                <div className="w-full rounded-lg p-3 transition-colors">
                  <div className="w-full aspect-square">
                    <img 
                      src={achievement.achievementIconUrl} 
                      alt={achievement.achievementName}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%234A7AD8"%3E%3Cpath d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                </div>
                
                <div className="w-full">
                  <h4 className="font-bold text-main text-center text-xs md:text-sm mb-1">
                    {achievement.achievementName}
                  </h4>
                  
                  <p className="text-main text-center text-[10px] md:text-xs leading-tight mb-2">
                    {achievement.achievementDescription}
                  </p>
                  
                  <p className="text-main-medium text-center text-[10px] md:text-xs">
                    {new Date(achievement.achievementTime).toLocaleDateString('ko-KR', {
                      year: '2-digit',
                      month: '2-digit',
                      day: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {achievementTotalPages > 1 && (
            <Pagination
              currentPage={achievementPage}
              totalPages={achievementTotalPages}
              onPageChange={setAchievementPage}
            />
          )}
        </>
      ) : (
        <div className="p-4 md:p-6 bg-gray-50 rounded-lg text-center">
          <MedalIcon className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 opacity-30" />
          <p className="text-main-medium text-sm md:text-base">획득한 업적이 없습니다.</p>
        </div>
      )}
    </div>
  );
};