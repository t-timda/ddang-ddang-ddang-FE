import React from "react";
import WaitingTrialItem from "./WaitingTrialItem";

interface WaitingCase {
  caseId: number;
  title: string;
  argumentAMain: string;
  createdAt: string; // ← 문자열("1일 전") 그대로 표시
}

interface WaitingTrialTableProps {
  cases: WaitingCase[];
  startIndex: number;
  totalCount: number;
  onCaseClick: (caseId: number) => void;
}

const WaitingTrialTable: React.FC<WaitingTrialTableProps> = ({
  cases,
  startIndex,
  onCaseClick,
}) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden border-2 border-gray-300">
      <div className="grid grid-cols-12 gap-4 bg-main-bright px-6 py-4 font-bold text-main-medium">
        <div className="col-span-1 text-center border-r border-gray-300">
          순서
        </div>
        <div className="col-span-3 text-center border-r border-gray-300">
          주장
        </div>
        <div className="col-span-6 text-center border-r border-gray-300">
          주제
        </div>
        <div className="col-span-2 text-center">등록한 시간</div>
      </div>

      {cases.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">대기 중인 재판이 없습니다.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {cases.map((caseItem, idx) => {
            // 페이지 기준 1, 2, 3, ... 순서로 보이게
            const displayIndex = startIndex + idx + 1;

            return (
              <WaitingTrialItem
                key={caseItem.caseId}
                index={displayIndex}
                caseId={caseItem.caseId}
                title={caseItem.title}
                argumentAMain={caseItem.argumentAMain}
                createdAt={caseItem.createdAt}
                onClick={() => onCaseClick(caseItem.caseId)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WaitingTrialTable;
