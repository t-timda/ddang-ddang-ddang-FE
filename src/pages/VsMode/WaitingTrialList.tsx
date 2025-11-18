import React, { useState } from "react";
import { mockWaitingCases } from "@/mock/vsModeData";
import WaitingTrialTable from "@/components/vs-mode/WaitingTrialTable";
import Pagination from "@/components/vs-mode/Pagination";
import { useVsModeStore } from "@/stores/vsModeStore";

const WaitingTrialList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { setStep, setCaseId } = useVsModeStore();
  const itemsPerPage = 10;

  // TODO: API 연결 시 useWaitingCasesQuery() 사용
  // 최신순 정렬 (createdAt 기준 내림차순)
  const sortedCases = [...mockWaitingCases].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const isLoading = false;

  // 전체 데이터 개수
  const totalCount = sortedCases.length;

  // 페이지네이션 계산
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCases = sortedCases.slice(startIndex, startIndex + itemsPerPage);

  const handleCaseClick = (caseId: number) => {
    setCaseId(caseId);
    setStep("join");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-main font-bold">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#203C77] mb-3">
            재판 매칭을 기다리고 있는 주제들이에요!
          </h1>
          <p className="text-gray-500">
            마음에 드는 논쟁을 골라 반대 입장으로서, 당신의 논리가 대결을 완성합니다!
          </p>
        </div>

        {/* 테이블 */}
        <WaitingTrialTable
          cases={currentCases}
          startIndex={startIndex}
          totalCount={totalCount}
          onCaseClick={handleCaseClick}
        />

        {/* 페이지네이션 */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default WaitingTrialList;