import judgeIllustrationUrl from "@/assets/svgs/FirstJudge.svg?url";
import ScaleIcon from "@/assets/svgs/Scale.svg?react";
import Button from "@/components/common/Button";
import { useFirstTrialStore } from "@/stores/firstTrialStore";
import { useNavigate } from "react-router-dom";
import { PATHS, PATH_BUILDERS } from "@/constants";

import {
  useFirstCaseDetailQuery,
  useFirstJudgmentQuery,
  usePatchFirstCaseDone,
} from "@/hooks/firstTrial/useFirstTrial";

export default function Judge() {
  const { reset, caseId } = useFirstTrialStore();
  const navigate = useNavigate();

  /* 서버 데이터 */
  const { data: detail } = useFirstCaseDetailQuery(caseId ?? undefined);
  const { data: judgment } = useFirstJudgmentQuery(caseId ?? undefined);
  const doneMut = usePatchFirstCaseDone();

  const title = detail?.result?.title ?? "사건";
  const aMain = detail?.result?.argumentA.mainArgument ?? "A입장";
  const bMain = detail?.result?.argumentB.mainArgument ?? "B입장";
  const verdict = judgment?.result?.verdict ?? "판결";
  const conclusion = judgment?.result?.conclusion ?? "";
  const ratioA = Math.round(judgment?.result?.ratioA ?? 50);
  const ratioB = Math.round(judgment?.result?.ratioB ?? 50);

  // 승자 입장 문구 (동률이면 A 기준)
  const winnerMain = ratioA >= ratioB ? aMain : bMain;
  const winnerRatio = ratioA >= ratioB ? ratioA : ratioB;

  return (
    <div className="flex flex-col items-center bg-white mx-auto px-[40px] min-h-screen pb-[100px] text-[#203C77] font-[Pretendard]">
      {/* 제목 */}
      <h1 className="text-[38px] font-bold text-center mt-[84px] leading-[150%]">
        초심 최종 판결
      </h1>

      {/* 파란 박스 */}
      <div className="relative w-[995px] h-[634px] bg-[#6596DA] rounded-[30px] mt-[84px]">
        {/* 상단: A vs B  */}
        <div className="flex justify-center items-start pt-[57px] gap-[56px] text-white font-bold">
          <p className="w-[300px] text-[28px] leading-[150%] text-center break-keep">
            {aMain}
          </p>
          <p className="text-[32px] leading-[150%]">VS</p>
          <p className="w-[300px] text-[28px] leading-[150%] text-center break-keep">
            {bMain}
          </p>
        </div>

        {/* 좌측: 말풍선 + 판사 */}
        <div className="absolute left-[57px] top-[162px]">
          <div className="relative">
            <div className="relative w-[316px] h-[78px] bg-white rounded-[30px] shadow-sm flex justify-center items-center px-[55px] py-[21px]">
              <p className="text-black text-[16px] font-normal leading-[150%] text-center">
                <span className="font-semibold">{winnerMain}</span> 의견이{" "}
                <span className="font-semibold">{winnerRatio}%</span> 더
                논리적입니다.
              </p>
              <div className="absolute left-[50px] bottom-[-20px] w-0 h-0 border-l-[24px] border-l-transparent border-r-[24px] border-r-transparent border-t-[24px] border-t-white"></div>
            </div>
          </div>
        </div>

        <img
          src={judgeIllustrationUrl}
          alt="판사 일러스트"
          className="absolute bottom-0 left-[30px] w-[410px] h-[385px]"
        />

        {/* 우측: 판결문 */}
        <div className="absolute top-[151px] right-[44px] w-[496px] h-[513px] bg-[#FFFFF6] rounded-[7px] flex flex-col items-center pt-[30px] text-[#EBAD27]">
          <p className="absolute left-[39px] top-[29px] text-[14px] leading-[150%] font-['Gapyeong_Hanseokbong']">
            사건번호 - {caseId ?? "?"}
          </p>
          <p className="absolute right-[45px] top-[26px] text-[14px] leading-[150%] text-right font-['Gapyeong_Hanseokbong']">
            AI 판사
          </p>
          <ScaleIcon
            className="absolute top-[24px] left-1/2 -translate-x-1/2 w-[48px] h-[48px] text-[#EBAD27] fill-[#EBAD27]"
            title="AI 판결 저울"
          />
          <h2 className="absolute top-[78px] left-1/2 -translate-x-1/2 text-[38px] font-bold leading-[150%] text-center text-[#EBAD27] font-['Gapyeong_Hanseokbong']">
            판결문
          </h2>

          <p className="absolute top-[150px] left-1/2 -translate-x-1/2 w-[420px] text-[13px] leading-[150%] text-center text-[#EBAD27] font-normal font-['Gapyeong_Hanseokbong']">
            사건명: {title}
          </p>

          <p className="absolute top-[249px] left-1/2 -translate-x-1/2 w-[420px] text-[15px] leading-[150%] text-center text-[#EBAD27] font-normal font-['Gapyeong_Hanseokbong']">
            {conclusion}
          </p>

          <p className="absolute top-[403px] left-1/2 -translate-x-1/2 w-[420px] text-[15px] font-bold leading-[150%] text-center text-[#EBAD27] font-['Gapyeong_Hanseokbong']">
            {verdict}
          </p>
        </div>
      </div>

      {/* 승률 바 */}
      <div className="mt-[60px] flex justify-center">
        <div className="relative w-[960px] h-[94px] bg-[#EAF1FD] rounded-[15px] flex justify-center items-center px-[32px] text-center shadow-sm">
          <p className="text-[#203C77] text-[20px] font-normal leading-[150%]">
            땅!땅!땅! 재판부는{" "}
            <span className="font-semibold">{winnerMain}</span>의 1심 승리를
            선고합니다!
          </p>
          <div className="absolute left-[-28px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[16px] border-t-transparent border-b-[16px] border-b-transparent border-r-[28px] border-r-[#EAF1FD]"></div>
        </div>
      </div>

      <div className="mt-[43px] flex justify-center">
        <div className="relative w-[995px] h-[44px] bg-[rgba(235,146,146,0.46)] rounded-[30px] overflow-hidden flex items-center justify-between px-[20px]">
          <div
            className="absolute left-0 top-0 h-full bg-[#809AD2] rounded-[30px]"
            style={{ width: `${ratioA}%` }}
          ></div>
          <div className="relative z-10 flex w-full justify-between items-center px-[20px]">
            <p className="text-white text-[16px] font-bold leading-[150%]">
              {aMain} {ratioA}%
            </p>
            <p className="text-white text-[16px] font-bold leading-[150%]">
              {bMain} {ratioB}%
            </p>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="mt-[84px] flex justify-center gap-[32px]">
        <Button
          variant="secondary"
          className="w-[380px] h-[123px]"
          onClick={async () => {
            if (caseId) await doneMut.mutateAsync({ caseId });
            reset();
            navigate(PATHS.ROOT);
          }}
        >
          <span className="text-white text-[36px] font-bold leading-normal">
            여기서 마치기
          </span>
        </Button>

        <Button
          variant="trialStart"
          className="w-[380px] h-[123px]"
          onClick={() => {
            if (!caseId) {
              alert("케이스 ID가 없습니다.");
              return;
            }
            // caseId를 localStorage에 저장
            localStorage.setItem("lastCaseId", String(caseId));
            // PATH_BUILDERS 사용하여 경로 생성
            navigate(PATH_BUILDERS.secondTrialRegister(caseId), { state: { caseId } });
          }}
        >
          <span className="text-white text-[36px] font-bold leading-normal">
            재심 신청하기
          </span>
        </Button>
      </div>
    </div>
  );
}
