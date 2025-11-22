import React from "react";
import UserOngoingTrialItem from "./UserOngoingTrialItem";

interface UserOngoingCase {
  caseId: number;
  title: string;
  argumentAMain: string;
  argumentBMain: string;
  status: string;
  stage: string; // "FIRST", "SECOND", "THIRD" 등
  createdAt: string;
}

interface UserOngoingTrialTableProps {
  cases: UserOngoingCase[];
  startIndex: number;
  totalCount: number;
  onCaseClick: (caseId: number) => void;
}

const UserOngoingTrialTable: React.FC<UserOngoingTrialTableProps> = ({
  cases,
  startIndex,
  totalCount,
  onCaseClick,
}) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden border-2 border-gray-300">
      {/* 테이블 헤더 */}
      <div className="grid grid-cols-12 gap-4 bg-main-bright px-6 py-4 font-bold text-main-medium">
        <div className="col-span-1 text-center border-r border-gray-300">순서</div>
        <div className="col-span-4 text-center border-r border-gray-300">주제</div>
        <div className="col-span-2 text-center border-r border-gray-300">A 주장</div>
        <div className="col-span-2 text-center border-r border-gray-300">B 주장</div>
        <div className="col-span-3 text-center">재판 단계</div>
      </div>

      {/* 테이블 바디 */}
      {cases.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">참여 중인 재판이 없습니다.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {cases.map((caseItem, idx) => (
            <UserOngoingTrialItem
              key={caseItem.caseId}
              index={totalCount - (startIndex + idx)}
              caseId={caseItem.caseId}
              title={caseItem.title}
              argumentAMain={caseItem.argumentAMain}
              argumentBMain={caseItem.argumentBMain}
              status={caseItem.status}
              stage={caseItem.stage}
              onClick={() => onCaseClick(caseItem.caseId)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOngoingTrialTable;
