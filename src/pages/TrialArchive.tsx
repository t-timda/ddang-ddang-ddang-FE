import React, { useState } from "react";
import { mockArchivedCases } from "@/mock/vsModeData";
import ArchiveTrialTable from "@/components/trial/ArchiveTrialTable";
import Pagination from "@/components/vs-mode/Pagination";

const TrialArchive: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // TODO: API 연결 시 useArchivedCasesQuery() 사용
  // 완료순 정렬 (completedAt 기준 내림차순)
  const sortedCases = [...mockArchivedCases].sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  );
  const isLoading = false;

  // 전체 데이터 개수
  const totalCount = sortedCases.length;

  // 페이지네이션 계산
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCases = sortedCases.slice(startIndex, startIndex + itemsPerPage);

  const handleCaseClick = (caseId: number) => {
    // TODO: 재판 결과 상세 페이지로 이동
    console.log("아카이브 재판 클릭:", caseId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-main font-bold">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-98px)] bg-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#203C77] mb-3">
            재판 아카이브
          </h1>
          <p className="text-gray-500">
            완료된 재판의 결과를 확인하고, 다양한 논쟁의 결론을 살펴보세요!
          </p>
        </div>

        {/* 테이블 */}
        <ArchiveTrialTable
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

export default TrialArchive;
