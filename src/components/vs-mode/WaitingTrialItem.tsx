import React from "react";

interface WaitingTrialItemProps {
  index: number;
  caseId: number;
  title: string;
  argumentAMain: string;
  createdAt: string;
  onClick: () => void;
}

const getTimeAgo = (createdAt: string): string => {
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now.getTime() - created.getTime();

  // 항상 "몇 시간 전"으로만 표시
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours <= 0) return "1시간 전";
  return `${diffHours}시간 전`;
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
      <div className="col-span-1 text-center flex items-center justify-center border-r border-gray-300">
        <span className="text-main-medium font-bold text-lg">{index}</span>
      </div>

      {/* 주장: 가운데 정렬 */}
      <div className="col-span-3 flex items-center justify-center text-center border-r border-gray-300">
        <span className="font-bold text-main">{argumentAMain}</span>
      </div>

      {/* 주제: 가운데 정렬 */}
      <div className="col-span-6 flex items-center justify-center text-center border-r border-gray-300">
        <span className="text-main-medium line-clamp-2">{title}</span>
      </div>

      <div className="col-span-2 text-center flex items-center justify-center">
        <span className="text-main-medium text-sm">
          {getTimeAgo(createdAt)}
        </span>
      </div>
    </div>
  );
};

export default WaitingTrialItem;
