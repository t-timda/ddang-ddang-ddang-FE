import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PATH_BUILDERS } from "@/constants";
import UserOngoingTrialTable from "@/components/trial/UserOngoingTrialTable";
import Pagination from "@/components/vs-mode/Pagination";
import { useUserCasesQuery } from "@/hooks/api/useUserQuery";

const UserOngoingList: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 유저가 참여 중인 재판 목록 조회
  const { data: userCasesRes, isLoading } = useUserCasesQuery();
  const allCases = userCasesRes?.result ?? [];

  // 진행 중인 재판만 필터링 (status가 DONE이 아닌 것들)
  const ongoingCases = useMemo(() => {
    return allCases.filter(c => c.status !== "DONE" && c.caseResult === "PENDING");
  }, [allCases]);

  // API 응답을 테이블 형식에 맞게 변환
  const cases = useMemo(() => {
    return ongoingCases.map(userCase => ({
      caseId: userCase.caseId,
      title: userCase.title,
      argumentAMain: userCase.mainArguments[0] || "A 입장",
      argumentBMain: userCase.mainArguments[1] || "B 입장",
      status: userCase.status,
      stage: userCase.status, // status가 재판 단계를 나타냄
      createdAt: "",
    }));
  }, [ongoingCases]);

  // caseId 내림차순 정렬 (최신 케이스 = 높은 ID)
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
    // 재판 단계에 따라 적절한 페이지로 이동
    const targetCase = cases.find(c => c.caseId === caseId);
    if (!targetCase) return;

    switch (targetCase.stage) {
      case "FIRST":
        navigate(PATH_BUILDERS.firstTrial(caseId));
        break;
      case "SECOND":
        navigate(PATH_BUILDERS.secondTrialRoundOne(caseId));
        break;
      case "THIRD":
        navigate(PATH_BUILDERS.thirdTrial(caseId));
        break;
      default:
        navigate(PATH_BUILDERS.secondTrialRoundOne(caseId));
    }
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
            내가 참여 중인 재판
          </h1>
          <p className="text-gray-500">
            현재 내가 참여하고 있는 재판 목록입니다.
          </p>
        </div>

        {/* 테이블 */}
        <UserOngoingTrialTable
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

export default UserOngoingList;
