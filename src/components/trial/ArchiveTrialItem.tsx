import React from "react";

interface ArchiveTrialItemProps {
  index: number;
  caseId: number;
  title: string;
  argumentAMain: string;
  argumentBMain: string;
  winner: string;
  winnerNickname: string;
  onClick: () => void;
}

const ArchiveTrialItem: React.FC<ArchiveTrialItemProps> = ({
  index,
  title,
  argumentAMain,
  argumentBMain,
  winner,
  winnerNickname,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="grid grid-cols-12 gap-4 px-6 py-5 hover:bg-main-bright/30 transition-colors cursor-pointer items-center"
    >
      {/* 순서 */}
      <div className="col-span-1 text-center text-main font-semibold">
        {index}
      </div>

      {/* 주제 */}
      <div className="col-span-4 text-main font-medium">
        {title}
      </div>

      {/* A 주장 */}
      <div className="col-span-3 text-gray-700 text-sm truncate">
        {argumentAMain}
      </div>

      {/* B 주장 */}
      <div className="col-span-3 text-gray-700 text-sm truncate">
        {argumentBMain}
      </div>

      {/* 승자 */}
      <div className="col-span-1 text-center">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
          winner === "A"
            ? "bg-blue-100 text-blue-700"
            : "bg-red-100 text-red-700"
        }`}>
          {winner}
        </span>
      </div>
    </div>
  );
};

export default ArchiveTrialItem;
