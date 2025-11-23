import React from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { PATH_BUILDERS } from '@/constants';
import clsx from 'clsx';
import Button from '@/components/common/Button';
import { useSecondTrialDetailsQuery, useVoteResultQuery } from "@/hooks/secondTrial/useSecondTrial";
import { useThirdTrialStore } from "@/stores/thirdTrialStore";
import { useJudgeStatusQuery } from "@/hooks/thirdTrial/useThirdTrial";
import { useAuthStore } from "@/stores/useAuthStore";

const SecondTrial_final: React.FC = () => {
  const { caseId: caseIdParam } = useParams<{ caseId?: string }>();
  const caseId = caseIdParam ? Number(caseIdParam) : undefined;
  const navigate = useNavigate();
  const { setCaseId, reset: resetThirdTrial } = useThirdTrialStore();

  // API 훅
  const { data: detailsRes, isLoading: isDetailsLoading } = useSecondTrialDetailsQuery(caseId);
  const details = detailsRes?.result;

  const { data: voteResultRes, isLoading: isVoteResultLoading } = useVoteResultQuery(caseId);
  const voteResult = voteResultRes?.result;

  // authStore에서 userId 가져오기
  const userId = useAuthStore((state) => state.userId);

  // 최종 판결 상태 조회
  const { data: judgeStatusRes, isLoading: isJudgeStatusLoading } = useJudgeStatusQuery(caseId);
  const judgeStatus = judgeStatusRes?.result;

  // 로딩
  if (isDetailsLoading || isVoteResultLoading || isJudgeStatusLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-main font-bold">로딩 중...</p>
      </div>
    );
  }

  // 데이터 없음 처리
  if (!details || !voteResult) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-4 px-4">
        <p className="text-main-red font-bold text-lg md:text-xl text-center">데이터를 받아오지 못했습니다</p>
        <div className="flex gap-3">
          <Button variant="primary" onClick={() => window.location.reload()}>다시 시도</Button>
          <Button variant="ghost" onClick={() => navigate(-1)}>이전으로</Button>
        </div>
      </div>
    );
  }

  // 투표 결과 (API 값만 사용)
  const ratioA = Math.max(0, Math.min(100, Math.round(voteResult.ratioA ?? 0)));
  const ratioB = Math.max(0, Math.min(100, Math.round(voteResult.ratioB ?? (100 - ratioA))));
  const totalVotes = voteResult.totalVotes ?? 0;

  // 어느 쪽이 이겼는지 판단
  const aWins = ratioA > ratioB;

  // 2차 재판 API의 A/B 주장 및 근거
  const aMainArgument = details.argumentA.mainArgument;
  const aReasoning = details.argumentA.reasoning;
  const bMainArgument = details.argumentB.mainArgument;
  const bReasoning = details.argumentB.reasoning;

  // 현재 로그인한 유저가 의견 작성자인지 확인
  const isAuthorA = userId !== null && userId === details.argumentA.authorId;
  const isAuthorB = userId !== null && userId === details.argumentB.authorId;
  const isEitherAuthor = isAuthorA || isAuthorB;

  // 최종심으로 가기 버튼 클릭 핸들러
  const handleGoToThirdTrial = () => {
    if (!caseId) return;

    // 3차 재판 store 초기화 및 caseId 설정
    resetThirdTrial();
    setCaseId(caseId);

    // 3차 재판 페이지로 이동
    navigate(PATH_BUILDERS.thirdTrial(caseId));
  };

  // 버튼 활성화 조건
  const isButtonEnabled =
    judgeStatus === "AFTER"
      ? true  // AFTER 상태면 누구나 활성화
      : userId !== null && isEitherAuthor;  // BEFORE 상태면 로그인되고 작성자인 경우만

  // 버튼 텍스트
  const buttonText = judgeStatus === "AFTER" ? "최종심 결과보기" : "최종심으로 가기";

  return (
    <div className="bg-white min-h-screen pt-6 md:pt-12 pb-12 md:pb-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-4">
        {/* 헤더 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-main">2차 재판</h1>
          <span className="bg-[#FFE5E5] px-3 py-2 md:p-4 rounded-lg text-sm md:text-md font-medium text-main-red">
            재판종료
          </span>
        </div>

        {/* 사건 제목 */}
        <p className="font-medium mb-6 md:mb-8 text-main text-sm md:text-base">
          {details.caseTitle}
        </p>

        {/* A/B 카드 */}
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6 lg:gap-8 lg:justify-between mb-8 md:mb-12">
          <div
            className={clsx(
              "w-full lg:w-[513px] h-[300px] sm:h-[350px] md:h-[400px] lg:h-[447px]",
              "bg-main-medium rounded-[20px] md:rounded-[30px]",
              "pt-[3px] pb-[16px] md:pt-[4px] md:pb-[24px] px-[4px] md:px-[6px]",
              "cursor-default opacity-70"
            )}
          >
            <div className="w-full h-full bg-[#94B0EB] rounded-[17px] md:rounded-[26px] flex justify-center items-center flex-col px-4 md:px-8 lg:px-12 py-6 md:py-8">
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-center text-white mb-2 md:mb-4">
                {aMainArgument}
              </span>
              <div className="text-center">
                <p className="text-xs md:text-sm text-white leading-relaxed">{aReasoning}</p>
              </div>
            </div>
          </div>

          <div
            className={clsx(
              "w-full lg:w-[513px] h-[300px] sm:h-[350px] md:h-[400px] lg:h-[447px]",
              "bg-main-red rounded-[20px] md:rounded-[30px]",
              "pt-[3px] pb-[16px] md:pt-[4px] md:pb-[24px] px-[4px] md:px-[6px]",
              "cursor-default opacity-70"
            )}
          >
            <div className="w-full h-full bg-[#FFA7A7] rounded-[17px] md:rounded-[26px] flex justify-center items-center flex-col px-4 md:px-8 lg:px-12 py-6 md:py-8">
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-center text-white mb-2 md:mb-4">
                {bMainArgument}
              </span>
              <div className="text-center">
                <p className="text-xs md:text-sm text-white leading-relaxed">{bReasoning}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 투표 결과 바 */}
        <div className="flex flex-col items-center mb-8 md:mb-12 pt-6 md:pt-8">
          <h2 className="text-xl md:text-2xl font-bold text-main mb-4 md:mb-6">2차 재판 투표 결과</h2>

          <div className="mt-6 md:mt-[43px] flex justify-center w-full px-2">
            <div className="relative w-full max-w-[995px] h-[36px] md:h-[44px] bg-[rgba(235,146,146,0.46)] rounded-[20px] md:rounded-[30px] overflow-hidden flex items-center justify-between px-[12px] md:px-[20px]">
              {/* A측 비율 바 */}
              <div
                className="absolute left-0 top-0 h-full bg-[#809AD2] rounded-[20px] md:rounded-[30px] transition-all duration-500"
                style={{ width: `${ratioA}%` }}
              >
                {/* A가 승리했을 때 입체감 효과 */}
                {aWins && (
                  <div 
                    className="absolute top-0 left-0 h-[40%] w-full rounded-t-[20px] md:rounded-t-[30px] bg-gradient-to-b from-white/30 to-transparent"
                  />
                )}
              </div>
              
              {/* B측 비율 바 (우측에서 시작) */}
              <div
                className="absolute right-0 top-0 h-full bg-[rgba(235,146,146,0.8)] rounded-[20px] md:rounded-[30px] transition-all duration-500"
                style={{ width: `${ratioB}%` }}
              >
                {/* B가 승리했을 때 입체감 효과 */}
                {!aWins && (
                  <div 
                    className="absolute top-0 left-0 h-[40%] w-full rounded-t-[20px] md:rounded-t-[30px] bg-gradient-to-b from-white/30 to-transparent"
                  />
                )}
              </div>
              
              {/* 비율 텍스트 */}
              <div className="relative z-10 flex w-full justify-between items-center px-[8px] md:px-[20px]">
                <p className={clsx(
                  "text-xs md:text-[16px] font-bold leading-[150%]",
                  aWins ? "text-white drop-shadow-md" : "text-white"
                )}>
                  A입장 {ratioA}%
                </p>
                <p className={clsx(
                  "text-xs md:text-[16px] font-bold leading-[150%]",
                  !aWins ? "text-white drop-shadow-md" : "text-white"
                )}>
                  B입장 {ratioB}%
                </p>
              </div>
            </div>
          </div>

          {totalVotes > 0 && (
            <p className="mt-3 md:mt-4 text-main text-xs md:text-sm">총 {totalVotes}명이 투표했습니다.</p>
          )}
        </div>

        {/* 최종심 결과보기 */}
        <div className="mt-6 md:mt-8 flex justify-center w-full">
          <Button
            variant="trialStart"
            size="lg"
            onClick={handleGoToThirdTrial}
            disabled={!isButtonEnabled}
            className="w-full max-w-[585px] h-[80px] md:h-[100px] lg:h-[123px] rounded-[20px] md:rounded-[30px] text-base md:text-lg"
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SecondTrial_final;