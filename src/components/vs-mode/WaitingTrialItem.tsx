// /dev/src/components/vs-mode/WaitingTrialItem.tsx
import React from "react";

interface WaitingTrialItemProps {
  index: number;
  caseId: number;
  title: string;
  argumentAMain: string;
  createdAt: string;
  onClick: () => void;
}

// 시간 차이 계산 함수
const getTimeAgo = (createdAt: string): string => {
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now.getTime() - created.getTime();

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  } else if (diffHours < 24) {
    return `${diffHours}시간 전`;
  } else {
    return `${diffDays}일 전`;
  }
};

const WaitingTrialItem: React.FC<WaitingTrialItemProps> = ({
  index,
  title,
  argumentAMain,
  createdAt,
  onClick,
}) => {
  return (
    <div
      className="grid grid-cols-12 gap-4 px-6 py-5 hover:bg-[#F8FBFF] cursor-pointer transition-colors"
      onClick={onClick}
    >
      {/* 순번 */}
      <div className="col-span-1 text-center flex items-center justify-center">
        <span className="text-main-medium font-bold text-lg">{index}</span>
      </div>

      {/* 제목 */}
      <div className="col-span-3 flex items-center">
        <span className="font-bold text-main">{argumentAMain}</span>
      </div>

      {/* 주장 */}
      <div className="col-span-6 flex items-center">
        <span className="text-main-medium line-clamp-2">{title}</span>
      </div>

      {/* 등록 시간 */}
      <div className="col-span-2 text-center flex items-center justify-center">
        <span className="text-main-medium text-sm">
          {getTimeAgo(createdAt)}
        </span>
      </div>
    </div>
  );
};

export default WaitingTrialItem;