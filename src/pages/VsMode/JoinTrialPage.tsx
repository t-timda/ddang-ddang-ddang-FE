import React from "react";
import Button from "@/components/common/Button";
import { mockWaitingCases } from "@/mock/vsModeData";
import { useVsModeStore } from "@/stores/vsModeStore";

const JoinTrialPage: React.FC = () => {
  const { caseId, setStep } = useVsModeStore();

  // TODO: API 연결 시 useFirstCaseDetailQuery(caseId) 사용
  const caseDetail = mockWaitingCases.find((c) => c.caseId === caseId);
  const isLoading = false;

  const handleJoinTrial = () => {
    if (!caseId) {
      alert("재판 ID가 없습니다.");
      return;
    }
    setStep("submit");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-main font-bold">로딩 중...</p>
      </div>
    );
  }

  if (!caseDetail) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-4">
        <p className="text-main-red font-bold text-xl">
          재판 정보를 불러올 수 없습니다
        </p>
        <Button variant="primary" onClick={() => setStep("waiting")}>
          이전으로
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* 헤더 */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-[#203C77] mb-8">재판 매칭</h1>
          <p className="text-gray-700 text-lg leading-relaxed">
            {caseDetail.title}
          </p>
        </div>

        {/* 카드 섹션 */}
        <div className="flex space-x-8 justify-center mb-12">
          {/* 좌측: 상대 입장 (A측) */}
          <div className="w-[350px] h-[280px] bg-gradient-to-br from-[#7FA7E8] to-[#6B95D6] rounded-3xl flex justify-center items-center flex-col shadow-lg">
            <h2 className="text-2xl font-bold text-white text-center mb-6 px-6">
              상대 입장
            </h2>
            <div className="px-8 space-y-2">
              <p className="text-white text-center text-sm leading-relaxed">
                {caseDetail.argumentAMain}
              </p>
              <p className="text-white text-center text-sm leading-relaxed">
                {caseDetail.argumentAReasoning.slice(0, 80)}...
              </p>
            </div>
          </div>

          {/* 우측: 매칭 상대를 기다리는 중 (B측) */}
          <div className="w-[350px] h-[280px] bg-gradient-to-br from-[#BDBDBD] to-[#9E9E9E] rounded-3xl flex justify-center items-center flex-col shadow-lg">
            <h2 className="text-2xl font-bold text-white text-center mb-8 px-6">
              매칭 상대를 기다리는 중..
            </h2>
            <div className="flex justify-center items-center">
              <div className="w-24 h-24 bg-white/90 rounded-full flex items-center justify-center shadow-md">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 정보 및 버튼 */}
        <div className="flex flex-col items-center gap-6 mt-12">
          {/* 의견 제시한 사람 */}
          <div className="flex gap-4 text-sm text-gray-600">
            <span>의견을 제시한 사람</span>
            <span className="font-bold text-[#4A7AD8]">칭호</span>
            <span>{caseDetail.authorNickname}</span>
          </div>

          {/* 참가하기 버튼 */}
          <Button
            variant="trialStart"
            size="lg"
            onClick={handleJoinTrial}
            className="p-4"
          >
            해당재판 참가하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JoinTrialPage;