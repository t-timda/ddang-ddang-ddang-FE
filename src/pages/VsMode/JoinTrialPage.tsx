import React from "react";
import Button from "@/components/common/Button";
import { useVsModeStore } from "@/stores/vsModeStore";
import { useJoinCaseQuery } from "@/hooks/vsMode/useJoinCaseQuery";
import UserIcon from "@/assets/svgs/User.svg?react";
import { useToast } from "@/hooks/useToast";

const JoinTrialPage: React.FC = () => {
  const { caseId, setStep } = useVsModeStore();
  const { showError } = useToast();

  // API: VS 사건 상세 조회
  const { data, isLoading, isError } = useJoinCaseQuery(caseId);

  const caseDetail = data?.result;

  const handleJoinTrial = () => {
    if (!caseId) {
      showError("재판 ID가 없습니다.");
      return;
    }
    setStep("submit");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen px-4">
        <p className="text-main font-bold">로딩 중...</p>
      </div>
    );
  }

  if (isError || !caseDetail) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-4 px-4 text-center">
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
    <div className="bg-white min-h-[calc(100vh-98px)] pt-12 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* 헤더 */}
        <div className="mb-12">
          <h1 className="text-2xl md:text-4xl font-bold text-[#203C77] mb-6 md:mb-8 text-left">
            재판 매칭
          </h1>
          <p className="leading-relaxed text-[#203C77] text-base md:text-lg break-keep">
            {caseDetail.title}
          </p>
        </div>

        {/* 카드 섹션 */}
        <div className="flex flex-col md:flex-row md:space-x-8 space-y-6 md:space-y-0 justify-center mb-12">
          {/* 상대 입장 (A측) */}
          <div className="w-full md:w-[492px] h-auto md:h-[291px] bg-main-medium rounded-[20px] md:rounded-[30px] pt-[3px] pb-[16px] md:pt-[4px] md:pb-[24px] px-[4px] md:px-[6px] shadow-lg hover:ring-2 hover:ring-blue-400 transition-all">
            <div className="w-full h-full bg-[#94B0EB] rounded-[17px] md:rounded-[26px] flex justify-center items-center flex-col px-4 md:px-8 lg:px-12 py-6 md:py-8 transition-all">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center text-white mb-2 md:mb-4">
                상대 입장
              </h2>
              <p className="text-sm md:text-base text-white text-center leading-relaxed break-keep mb-1">
                {caseDetail.argumentA?.mainArgument}
              </p>
              <p className="text-xs md:text-sm text-white text-center leading-relaxed break-keep">
                {caseDetail.argumentA?.reasoning?.slice(0, 80)}...
              </p>
            </div>
          </div>

          {/* 우측: 매칭 대기 중 */}
          <div className="w-full md:w-[492px] h-auto md:h-[291px] bg-[#B0B0B0] rounded-[20px] md:rounded-[30px] pt-[3px] pb-[16px] md:pt-[4px] md:pb-[24px] px-[4px] md:px-[6px] shadow-lg">
            <div className="w-full h-full bg-[#DFDFDF] rounded-[17px] md:rounded-[26px] flex flex-col items-center px-4 md:px-6 lg:px-8 pt-6 md:pt-8 pb-4 md:pb-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#797979] text-center mb-4">
                매칭 상대를 기다리는 중..
              </h2>
              {/* mt-auto로 아이콘을 안쪽 상자 하단에 붙이기 */}
              <UserIcon
                className="mt-auto mb-1 w-[96px] h-[120px] md:w-[136px] md:h-[170px] shrink-0"
                title="매칭 상대 아이콘"
              />
            </div>
          </div>
        </div>

        {/* 하단 정보 및 버튼 */}
        <div className="flex flex-col items-center gap-6 mt-8 md:mt-12 px-4">
          <div className="flex flex-col md:flex-row gap-2 md:gap-4 text-base md:text-lg text-gray-600 text-center md:text-left">
            <span>상대 의견</span>
            <span className="font-bold text-[#4A7AD8] break-keep">
              {caseDetail.argumentA?.mainArgument}
            </span>
          </div>

          <Button
            variant="trialStart"
            size="lg"
            className="w-full max-w-[340px] h-[72px] md:h-[100px] text-[24px] md:text-[36px] font-bold rounded-[15px]"
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
