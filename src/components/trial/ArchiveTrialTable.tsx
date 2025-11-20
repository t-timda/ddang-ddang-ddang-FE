import React from "react";
import ArchiveTrialItem from "./ArchiveTrialItem";

interface ArchivedCase {
  caseId: number;
  title: string;
  argumentAMain: string;
  argumentBMain: string;
  authorNickname: string;
  rivalNickname: string;
  winner: string;
  winnerNickname: string;
  status: string;
  createdAt: string;
  completedAt: string;
}

interface ArchiveTrialTableProps {
  cases: ArchivedCase[];
  startIndex: number;
  totalCount: number;
  onCaseClick: (caseId: number) => void;
}

const ArchiveTrialTable: React.FC<ArchiveTrialTableProps> = ({
  cases,
  startIndex,
  totalCount,
  onCaseClick,
}) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden">
      {/* 테이블 헤더 */}
      <div className="grid grid-cols-12 gap-4 bg-main-bright px-6 py-4 font-bold text-main-medium">
        <div className="col-span-1 text-center">순서</div>
        <div className="col-span-4 text-center">주제</div>
        <div className="col-span-3 text-center">A 주장</div>
        <div className="col-span-3 text-center">B 주장</div>
        <div className="col-span-1 text-center">승자</div>
      </div>

      {/* 테이블 바디 */}
      {cases.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">아카이브된 재판이 없습니다.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {cases.map((caseItem, idx) => (
            <ArchiveTrialItem
              key={caseItem.caseId}
              index={totalCount - (startIndex + idx)}
              caseId={caseItem.caseId}
              title={caseItem.title}
              argumentAMain={caseItem.argumentAMain}
              argumentBMain={caseItem.argumentBMain}
              winner={caseItem.winner}
              winnerNickname={caseItem.winnerNickname}
              onClick={() => onCaseClick(caseItem.caseId)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ArchiveTrialTable;
