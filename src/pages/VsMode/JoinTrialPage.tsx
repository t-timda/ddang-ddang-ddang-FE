import React from "react";
import Button from "@/components/common/Button";
import { useVsModeStore } from "@/stores/vsModeStore";
import { useJoinCaseQuery } from "@/hooks/vsMode/useJoinCaseQuery";
import UserIcon from "@/assets/svgs/User.svg?react";

const JoinTrialPage: React.FC = () => {
  const { caseId, setStep } = useVsModeStore();

  // API: VS 사건 상세 조회
  const { data, isLoading, isError } = useJoinCaseQuery(caseId);

  const caseDetail = data?.result;

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

  if (isError || !caseDetail) {
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
    <div className="bg-white pt-12 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* 헤더 */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-[#203C77] mb-8">재판 매칭</h1>
          <p className="leading-relaxed text-[#203C77]">{caseDetail.title}</p>
        </div>

        {/* 카드 섹션 */}
        <div className="flex space-x-8 justify-center mb-12">
          {/* 상대 입장 (A측) */}
          <div className="w-[492px] h-[291px] bg-[#94B0EB] rounded-3xl flex flex-col items-center pt-[45px] shadow-lg">
            <h2 className="text-2xl font-bold text-white text-center mb-[28px] px-6">
              상대 입장
            </h2>
            <div className="px-8 space-y-2">
              <p className="text-white text-center text-lg leading-relaxed">
                {caseDetail.argumentA?.mainArgument}
              </p>
              <p className="text-white text-center text-lg leading-relaxed">
                {caseDetail.argumentA?.reasoning?.slice(0, 80)}...
              </p>
            </div>
          </div>

          {/* 우측: 매칭 대기 중 */}
          <div className="w-[492px] h-[291px] bg-[#DFDFDF] rounded-3xl flex flex-col items-center pt-[45px] shadow-lg">
            <h2 className="text-2xl font-bold text-[#797979] text-center px-6">
              매칭 상대를 기다리는 중..
            </h2>
            <div className="flex justify-center items-center mt-9">
              <UserIcon
                className="w-[136px] h-[170px] shrink-0"
                title="매칭 상대 아이콘"
              />
            </div>
          </div>
        </div>

        {/* 하단 정보 및 버튼 */}
        <div className="flex flex-col items-center gap-6 mt-12">
          <div className="flex gap-4 text-lg text-gray-600">
            <span>상대 의견</span>
            <span className="font-bold text-[#4A7AD8]">
              {caseDetail.argumentA?.mainArgument}
            </span>
          </div>

          <Button
            variant="trialStart"
            size="lg"
            className="w-[340px] h-[100px] text-[36px] font-bold rounded-[15px]"
            onClick={handleJoinTrial}
          >
            해당재판 참가하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JoinTrialPage;
