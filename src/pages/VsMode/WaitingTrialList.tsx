// WaitingTrialList.tsx
import React, { useState } from "react";
import WaitingTrialTable from "@/components/vs-mode/WaitingTrialTable";
import Pagination from "@/components/vs-mode/Pagination";
import { useVsModeStore } from "@/stores/vsModeStore";
import { useWaitingVsCasesQuery } from "@/hooks/vsMode/useWaitingCasesQuery";

const WaitingTrialList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { setStep, setCaseId } = useVsModeStore();
  const itemsPerPage = 10;

  /** createdAt: [yyyy, MM, dd, HH, mm, ss, nano] 또는 ISO 문자열 → JS Date */
  const parseSpringDateArray = (value: number[] | string) => {
    if (!value) return new Date();

    // 1) 배열 형식 [yyyy, MM, dd, HH, mm, ss, nano]  → UTC 기준으로 해석
    if (Array.isArray(value) && value.length >= 6) {
      const [y, M, d, h, m, s] = value;
      // 백엔드가 UTC 기준으로 보내서 9시간 밀리는 문제를 막기 위해 Date.UTC 사용
      return new Date(Date.UTC(y, M - 1, d, h, m, s));
    }

    // 2) 문자열 형식 "2025-11-19T15:10:01.802Z" 등
    if (typeof value === "string") {
      const d = new Date(value);
      if (!isNaN(d.getTime())) return d;
    }

    // 3) 혹시라도 이상하면 현재 시간으로 fallback
    return new Date();
  };

  // VS 모드 대기 목록 가져오기
  const { data, isLoading } = useWaitingVsCasesQuery();
  const waitingCases = data?.result ?? [];

  /** 최신순 정렬 시 new Date() 금지!! 반드시 parseSpringDateArray 사용 */
  const sortedCases = [...waitingCases].sort((a, b) => {
    const dateA = parseSpringDateArray(a.createdAt).getTime();
    const dateB = parseSpringDateArray(b.createdAt).getTime();
    return dateB - dateA;
  });

  /** 여기서 createdAt은 "진짜 날짜" 문자열로 넘기고,
   *  몇 분/시간/일 전 텍스트는 WaitingTrialItem.getTimeAgo에서 계산
   */
  const mappedCases = sortedCases.map((c) => {
    const date = parseSpringDateArray(c.createdAt);
    const safeDate = date && !isNaN(date.getTime()) ? date : new Date();

    return {
      caseId: c.caseId,
      title: c.title,
      argumentAMain: c.argumentAMain,
      // ISO 문자열로 넘기면 WaitingTrialItem에서 new Date(…)로 안전하게 파싱 가능
      createdAt: safeDate.toISOString(),
    };
  });

  const totalCount = mappedCases.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentCases = mappedCases.slice(startIndex, startIndex + itemsPerPage);

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
    <div className="min-h-[calc(100vh-98px)] bg-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#203C77] mb-3">
            재판 매칭을 기다리고 있는 주제들이에요!
          </h1>
          <p className="text-gray-500">
            마음에 드는 논쟁을 골라 반대 입장으로서, 당신의 논리가 대결을
            완성합니다!
          </p>
        </div>

        <WaitingTrialTable
          cases={currentCases}
          startIndex={startIndex}
          totalCount={totalCount}
          onCaseClick={handleCaseClick}
        />

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
