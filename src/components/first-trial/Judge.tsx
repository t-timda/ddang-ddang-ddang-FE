import judgeIllustrationUrl from "@/assets/svgs/FirstJudge.svg?url";
import ScaleIcon from "@/assets/svgs/Scale.svg?react";
import Button from "@/components/common/Button";
import { useFirstTrialStore } from "@/stores/firstTrialStore";
import { useNavigate } from "react-router-dom";
import { PATHS, PATH_BUILDERS } from "@/constants";
import { useToast } from "@/hooks/useToast";
import { motion } from "framer-motion";

import {
  useFirstCaseDetailQuery,
  useFirstJudgmentQuery,
  usePatchFirstCaseDone,
} from "@/hooks/firstTrial/useFirstTrial";

export default function Judge() {
  const { reset, caseId } = useFirstTrialStore();
  const navigate = useNavigate();
  const { showError } = useToast();

  /* 서버 데이터 */
  const { data: detail } = useFirstCaseDetailQuery(caseId ?? undefined);
  const { data: judgment } = useFirstJudgmentQuery(caseId ?? undefined);
  const doneMut = usePatchFirstCaseDone();

  const title = detail?.result?.title ?? "사건";
  const aMain = detail?.result?.argumentA.mainArgument ?? "A입장";
  const bMain = detail?.result?.argumentB?.mainArgument ?? "B입장";
  const verdict = judgment?.result?.verdict ?? "판결";
  const conclusion = judgment?.result?.conclusion ?? "";
  const ratioA = Math.round(judgment?.result?.ratioA ?? 50);
  const ratioB = Math.round(judgment?.result?.ratioB ?? 50);

  // 승자 입장 문구 (동률이면 A 기준)
  const winnerMain = ratioA >= ratioB ? aMain : bMain;
  const winnerRatio = ratioA >= ratioB ? ratioA : ratioB;

  return (
    <div className="flex flex-col items-center bg-white mx-auto w-full max-w-[1440px] px-4 md:px-[40px] min-h-[calc(100vh-98px)] pb-[100px] text-[#203C77] font-[Pretendard]">
      {/* 제목 */}
      <h1 className="text-[28px] md:text-[38px] font-bold text-center mt-10 leading-[150%]">
        초심 최종 판결
      </h1>

      {/* 파란 박스 */}
      <div className="relative w-full max-w-[995px] h-[634px] bg-[#6596DA] rounded-[30px] mt-10">
        {/* 상단: A vs B  */}
        <div className="flex justify-center items-start pt-[40px] md:pt-[57px] gap-[24px] md:gap-[56px] text-white font-bold px-4 md:px-0">
          <p className="w-[45%] md:w-[300px] text-[20px] md:text-[28px] leading-[150%] text-center break-keep">
            {aMain}
          </p>
          <p className="text-[24px] md:text-[32px] leading-[150%]">VS</p>
          <p className="w-[45%] md:w-[300px] text-[20px] md:text-[28px] leading-[150%] text-center break-keep">
            {bMain}
          </p>
        </div>

        {/* 좌측: 말풍선 + 판사 */}
        <div className="absolute left-[24px] md:left-[57px] top-[150px] md:top-[162px]">
          <div className="relative">
            <div className="relative w-[260px] md:w-[316px] h-[72px] md:h-[78px] bg-white rounded-[30px] shadow-sm flex justify-center items-center px-[28px] md:px-[55px] py-[16px] md:py-[21px]">
              <p className="text-black text-[14px] md:text-[16px] font-normal leading-[150%] text-center">
                <span className="font-semibold">{winnerMain}</span> 의견이{" "}
                <span className="font-semibold">{winnerRatio}%</span>로 더
                논리적입니다.
              </p>
              <div className="absolute left-[40px] md:left-[50px] bottom-[-20px] w-0 h-0 border-l-[20px] md:border-l-[24px] border-l-transparent border-r-[20px] md:border-r-[24px] border-r-transparent border-t-[24px] border-t-white"></div>
            </div>
          </div>
        </div>

        <img
          src={judgeIllustrationUrl}
          alt="판사 일러스트"
          className="absolute bottom-0 left-[10px] md:left-[30px] w-[260px] md:w-[410px] h-[244px] md:h-[385px]"
        />

        {/* 우측: 판결문 */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-[130px] md:top-[151px] right-[12px] md:right-[44px] w-[320px] md:w-[496px] h-[420px] md:h-[450px] bg-[#FFFFF6] rounded-[7px] flex flex-col items-center text-[#EBAD27]"
        >
          <p className="absolute left-[20px] md:left-[39px] top-[20px] md:top-[29px] text-[12px] md:text-[14px] leading-[150%] font-['Gapyeong_Hanseokbong']">
            사건번호 - {caseId ?? "?"}
          </p>
          <p className="absolute right-[20px] md:right-[45px] top-[18px] md:top-[26px] text-[12px] md:text-[14px] leading-[150%] text-right font-['Gapyeong_Hanseokbong']">
            AI 판사
          </p>
          <ScaleIcon
            className="absolute top-[20px] md:top-[24px] left-1/2 -translate-x-1/2 w-[40px] h-[40px] md:w-[48px] md:h-[48px] text-[#EBAD27] fill-[#EBAD27]"
            title="AI 판결 저울"
          />
          <h2 className="absolute top-[70px] md:top-[78px] left-1/2 -translate-x-1/2 text-[28px] md:text-[38px] font-bold leading-[150%] text-center text-[#EBAD27] font-['Gapyeong_Hanseokbong']">
            판결문
          </h2>

          {/* 스크롤 가능한 판결문 영역 */}
          <div className="absolute top-[130px] md:top-[150px] left-1/2 -translate-x-1/2 w-[280px] md:w-[420px] h-[240px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#EBAD27] scrollbar-track-[#FFFFF6]">
            <p className="text-lg md:text-[13px] leading-[150%] text-center text-[#EBAD27] font-normal font-['Gapyeong_Hanseokbong'] mb-4">
              사건명: {title}
            </p>

            <p className="text-[13px] md:text-[15px] leading-[150%] text-center text-[#EBAD27] font-normal font-['Gapyeong_Hanseokbong'] whitespace-pre-line px-2">
              {conclusion}
            </p>
            <br />
            <p className="text-[13px] md:text-[15px] leading-[150%] text-center text-[#EBAD27] font-normal font-['Gapyeong_Hanseokbong'] whitespace-pre-line px-2">
              {verdict}
            </p>
          </div>
        </motion.div>
      </div>

      {/* 승률 바 상단 문구 */}
      <div className="mt-[40px] md:mt-[60px] flex justify-center w-full">
        <div className="relative w-full max-w-[960px] h-[80px] md:h-[94px] bg-[#EAF1FD] rounded-[15px] flex justify-center items-center px-4 md:px-[32px] text-center shadow-sm">
          <p className="text-[#203C77] text-[16px] md:text-[20px] font-normal leading-[150%]">
            땅!땅!땅! 재판부는{" "}
            <span className="font-semibold">{winnerMain}</span>의 1심 승리를
            선고합니다!
          </p>
          <div className="absolute left-[-20px] md:left-[-28px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[12px] md:border-t-[16px] border-t-transparent border-b-[12px] md:border-b-[16px] border-b-transparent border-r-[20px] md:border-r-[28px] border-r-[#EAF1FD]"></div>
        </div>
      </div>

      {/* 승률 바 */}
      <div className="mt-[28px] md:mt-[43px] flex justify-center w-full">
        <div className="relative w-full max-w-[995px] h-[40px] md:h-[44px] bg-[rgba(235,146,146,0.46)] rounded-[30px] overflow-hidden flex items-center justify-between px-[12px] md:px-[20px]">
          <div
            className="absolute left-0 top-0 h-full bg-[#809AD2] rounded-[30px]"
            style={{ width: `${ratioA}%` }}
          ></div>
          <div className="relative z-10 flex w-full justify-between items-center px-[12px] md:px-[20px]">
            <p className="text-white text-[14px] md:text-[16px] font-bold leading-[150%]">
              {aMain} {ratioA}%
            </p>
            <p className="text-white text-[14px] md:text-[16px] font-bold leading-[150%]">
              {bMain} {ratioB}%
            </p>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="mt-[60px] md:mt-[84px] flex flex-col md:flex-row justify-center gap-[16px] md:gap-[32px] w-full max-w-[995px]">
        <Button
          variant="secondary"
          className="w-full md:w-[380px] h-[80px] md:h-[123px]"
          onClick={async () => {
            if (caseId) await doneMut.mutateAsync({ caseId });
            reset();
            navigate(PATHS.ROOT);
          }}
        >
          <span className="text-white text-[22px] md:text-[36px] font-bold leading-normal">
            여기서 마치기
          </span>
        </Button>

        <Button
          variant="trialStart"
          className="w-full md:w-[380px] h-[80px] md:h-[123px]"
          onClick={() => {
            if (!caseId) {
              showError("케이스 ID가 없습니다.");
              return;
            }
            // caseId를 localStorage에 저장
            localStorage.setItem("lastCaseId", String(caseId));
            // PATH_BUILDERS 사용하여 경로 생성
            navigate(PATH_BUILDERS.secondTrialRegister(caseId), {
              state: { caseId },
            });
          }}
        >
          <span className="text-white text-[22px] md:text-[36px] font-bold leading-normal">
            재심 신청하기
          </span>
        </Button>
      </div>
    </div>
  );
}
