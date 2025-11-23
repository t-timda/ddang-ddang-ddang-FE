// dev/src/pages/SecondTrial/SecondTrialRegister.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Button from "@/components/common/Button";
import { PATHS } from "@/constants";
import { useStartSecondTrialMutation } from "@/hooks/secondTrial/useSecondTrial";
import { useFirstCaseDetailQuery } from "@/hooks/firstTrial/useFirstTrial";

const SecondTrialRegister: React.FC = () => {
  const [duration, setDuration] = useState<string>("");
  const navigate = useNavigate();
  const { caseId: caseIdParam } = useParams<{ caseId: string }>();
  const caseId = caseIdParam ? Number(caseIdParam) : undefined;
  const startSecond = useStartSecondTrialMutation();

  // 1차 재판 상세 정보 조회 (title, argumentA, argumentB)
  const { data: caseDetailRes, isLoading: isCaseDetailLoading } = useFirstCaseDetailQuery(caseId);
  const caseDetail = caseDetailRes?.result;

  const handleStartClick = async () => {
    if (!caseId) {
      alert("케이스 ID가 없습니다. 1차 재판에서 넘어온 caseId를 확인해 주세요.");
      return;
    }

    if (!duration) {
      alert("변호 종료 시간을 선택해 주세요.");
      return;
    }

    try {
      // hoursToAdd를 요청 바디에 포함하여 2차 재판 시작
      await startSecond.mutateAsync({
        caseId,
        body: {
          hoursToAdd: Number(duration),
        },
      });
      // 성공 시 페이지 이동
      navigate(`${PATHS.SECOND_TRIAL_ROUND_ONE}/${caseId}`);
    } catch (err) {
      console.error("2차 재판 시작 실패:", err);
      alert("2차 재판 시작에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  // 로딩 상태 처리
  if (isCaseDetailLoading) {
    return (
      <div className="flex flex-col items-center pt-6 md:pt-10 gap-y-6 md:gap-y-10 pb-20 md:pb-30 px-4">
        <h1 className="text-xl md:text-2xl font-bold text-center text-main">2차 재판 등록</h1>
        <p className="text-main text-sm md:text-base">사건 정보를 불러오는 중...</p>
      </div>
    );
  }

  // 케이스 상세 정보가 없을 때
  if (!caseDetail) {
    return (
      <div className="flex flex-col items-center pt-6 md:pt-10 gap-y-6 md:gap-y-10 pb-20 md:pb-30 px-4">
        <h1 className="text-xl md:text-2xl font-bold text-center text-main">2차 재판 등록</h1>
        <p className="text-main-red text-sm md:text-base">사건 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center pt-6 md:pt-10 gap-y-6 md:gap-y-10 pb-20 md:pb-30 px-4">
      <h1 className="text-xl md:text-2xl font-bold text-center text-main">2차 재판 등록</h1>

      {/* A/B 주장 카드 */}
      <div className="flex flex-col lg:flex-row gap-4 md:gap-6 lg:gap-[31px] w-full max-w-6xl justify-center items-center">
        {/* A 카드 - 그림자 레이어 추가 */}
        <div className="w-full lg:w-[513px] h-[300px] sm:h-[350px] md:h-[400px] lg:h-[447px] bg-main-medium rounded-[20px] md:rounded-[30px] pt-[3px] pb-[16px] md:pt-[4px] md:pb-[24px] px-[4px] md:px-[6px]">
          <div className="w-full h-full bg-[#94B0EB] rounded-[17px] md:rounded-[26px] flex justify-center items-center flex-col px-4 md:px-8 lg:px-12 py-6 md:py-8">
            <span className="text-lg sm:text-xl md:text-2xl font-bold text-center text-white mb-2 md:mb-4">
              {caseDetail.argumentA.mainArgument}
            </span>
            <p className="text-xs md:text-sm lg:text-base text-white text-center leading-relaxed">
              {caseDetail.argumentA.reasoning}
            </p>
          </div>
        </div>
        
        {/* B 카드 - 그림자 레이어 추가 */}
        <div className="w-full lg:w-[513px] h-[300px] sm:h-[350px] md:h-[400px] lg:h-[447px] bg-main-red rounded-[20px] md:rounded-[30px] pt-[3px] pb-[16px] md:pt-[4px] md:pb-[24px] px-[4px] md:px-[6px]">
          <div className="w-full h-full bg-[#FFA7A7] rounded-[17px] md:rounded-[26px] flex justify-center items-center flex-col px-4 md:px-8 lg:px-12 py-6 md:py-8">
            <span className="text-lg sm:text-xl md:text-2xl font-bold text-center text-white mb-2 md:mb-4">
              {caseDetail.argumentB?.mainArgument}
            </span>
            <p className="text-xs md:text-sm lg:text-base text-white text-center leading-relaxed">
              {caseDetail.argumentB?.reasoning}
            </p>
          </div>
        </div>
      </div>

      {/* 사건 제목 */}
      <div className="w-full max-w-[1058px] flex justify-center items-center pb-4 md:pb-6 px-4">
        <h1 className="text-main text-base md:text-lg lg:text-[24px] text-center leading-relaxed">
          {caseDetail.title}
        </h1>
      </div>

      {/* 투표 종료 시간 설정 */}
      <h1 className="text-xl md:text-2xl font-bold text-center text-main">투표 종료 시간 설정</h1>

      <select
        id="durationSelect"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        className="
          w-full max-w-[585px] h-[80px] md:h-[100px] lg:h-[123px]
          bg-main-bright
          rounded-[20px] md:rounded-[30px]
          text-base md:text-lg font-bold text-center
          flex items-center justify-center
          focus:outline-none focus:ring-2 focus:ring-main-medium
          text-main
          px-4
        "
      >
        <option value="">시간 선택</option>
        <option value="1">1시간</option>
        <option value="2">2시간</option>
        <option value="3">3시간</option>
        <option value="12">12시간</option>
        <option value="24">24시간</option>
        <option value="48">48시간</option>
        <option value="72">72시간</option>
      </select>

      {/* 시작 버튼 */}
      <Button
        variant="trialStart"
        size="lg"
        className="w-full max-w-[585px] h-[80px] md:h-[100px] lg:h-[123px] rounded-[20px] md:rounded-[30px] text-base md:text-lg"
        onClick={handleStartClick}
        disabled={startSecond.isPending || !duration}
      >
        {startSecond.isPending ? "시작 요청중..." : "2차 재판 시작하기"}
      </Button>
    </div>
  );
};

export default SecondTrialRegister;