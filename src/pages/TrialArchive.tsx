import React, { useState, useMemo } from "react";
import { useFinishedCasesQuery } from "@/hooks/cases/useCases";
import ArchiveTrialTable from "@/components/trial/ArchiveTrialTable";
import Pagination from "@/components/vs-mode/Pagination";
import JudgmentHistoryModal from "@/components/common/JudgmentHistoryModal";

const TrialArchive: React.FC = () => {
  const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 완료된 재판 목록 조회
  const { data: finishedCasesRes, isLoading } = useFinishedCasesQuery();
  const finishedCases = finishedCasesRes?.result ?? [];

  // 아카이브 테이블 형식에 맞게 데이터 변환
  const cases = useMemo(() => {
    return finishedCases.map(finishedCase => {
      const [argumentAMain = "A 주장", argumentBMain = "B 주장"] = finishedCase.mainArguments ?? [];
      return {
        caseId: finishedCase.caseId,
        title: finishedCase.title || "제목 없음",
        argumentAMain,
        argumentBMain,
        authorNickname: "",
        rivalNickname: "",
        status: finishedCase.status,
        createdAt: "",
        completedAt: "",
      };
    });
  }, [finishedCases]);

  // 최신 사건 순 정렬 (caseId 내림차순)
  const sortedCases = useMemo(() => {
    return [...cases].sort((a, b) => b.caseId - a.caseId);
  }, [cases]);

  // 전체 데이터 개수
  const totalCount = sortedCases.length;

  // 페이지네이션 계산
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCases = sortedCases.slice(startIndex, startIndex + itemsPerPage);

  const handleCaseClick = (caseId: number) => {
    setSelectedCaseId(caseId);
  };

  const handleCloseHistory = () => {
    setSelectedCaseId(null);
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

        {/* 판결 히스토리 모달 */}
        {selectedCaseId && (
          <JudgmentHistoryModal
            caseId={selectedCaseId}
            onClose={handleCloseHistory}
          />
        )}
      </div>
    </div>
  );
};

export default TrialArchive;
