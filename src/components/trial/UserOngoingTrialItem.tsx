import React from "react";

interface UserOngoingTrialItemProps {
  index: number;
  caseId: number;
  title: string;
  argumentAMain: string;
  argumentBMain: string;
  status: string;
  stage: string; // "FIRST", "SECOND", "THIRD" 등
  onClick: () => void;
}

const stageToText = (stage: string): string => {
  switch (stage) {
    case "FIRST":
      return "1차 재판";
    case "SECOND":
      return "2차 재판";
    case "THIRD":
      return "3차 재판";
    case "PENDING":
      return "대기 중";
    case "DONE":
      return "완료";
    default:
      return stage;
  }
};

const UserOngoingTrialItem: React.FC<UserOngoingTrialItemProps> = ({
  index,
  title,
  argumentAMain,
  argumentBMain,
  stage,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="grid grid-cols-12 gap-4 px-6 py-5 hover:bg-main-bright/30 transition-colors cursor-pointer items-center"
    >
      {/* 순서 */}
      <div className="col-span-1 text-center text-main font-semibold border-r border-gray-300 flex items-center justify-center">
        {index}
      </div>

      {/* 주제 */}
      <div className="col-span-4 text-main font-medium border-r border-gray-300 flex items-center">
        {title}
      </div>

      {/* A 주장 */}
      <div className="col-span-2 text-gray-700 text-sm truncate border-r border-gray-300 flex items-center">
        {argumentAMain}
      </div>

      {/* B 주장 */}
      <div className="col-span-2 text-gray-700 text-sm truncate border-r border-gray-300 flex items-center">
        {argumentBMain}
      </div>

      {/* 재판 단계 */}
      <div className="col-span-3 text-center flex items-center justify-center">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
          {stageToText(stage)}
        </span>
      </div>
    </div>
  );
};

export default UserOngoingTrialItem;
