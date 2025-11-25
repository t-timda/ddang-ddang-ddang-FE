import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PATH_BUILDERS } from "@/constants";
import OngoingTrialTable from "@/components/trial/OngoingTrialTable";
import Pagination from "@/components/vs-mode/Pagination";
import { useOngoingCasesQuery } from "@/hooks/cases/useCases";

const OngoingTrialList: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 진행중인 재판 목록 조회
  const { data: ongoingCasesRes, isLoading } = useOngoingCasesQuery();
  const apiCases = ongoingCasesRes?.result ?? [];

  // API 응답을 테이블 형식에 맞게 변환
  const cases = useMemo(() => {
    return apiCases.map(apiCase => ({
      caseId: apiCase.caseId,
      title: apiCase.title,
      argumentAMain: apiCase.mainArguments[0] || "A 입장",
      argumentBMain: apiCase.mainArguments[1] || "B 입장",
      authorNickname: "",
      rivalNickname: "",
      status: apiCase.status,
      createdAt: "", // API 응답에 createdAt이 없음
    }));
  }, [apiCases]);

  // caseId 내림차순 정렬 (최신 케이스가 높은 ID를 가진다고 가정)
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
    // 2차 재판 페이지로 이동
    navigate(PATH_BUILDERS.secondTrialRoundOne(caseId));
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
            참여 가능한 재판
          </h1>
          <p className="text-gray-500">
            현재 많은 변호사들이 참여중인 재판을 살펴봐요!
          </p>
        </div>

        {/* 테이블 */}
        <OngoingTrialTable
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

export default OngoingTrialList;
