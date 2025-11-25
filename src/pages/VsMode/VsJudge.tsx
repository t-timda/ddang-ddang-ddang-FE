import judgeIllustrationUrl from "@/assets/svgs/FirstJudge.svg?url";
import ScaleIcon from "@/assets/svgs/Scale.svg?react";
import Button from "@/components/common/Button";
import { useVsModeStore } from "@/stores/vsModeStore";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/constants";
import { useQuery } from "@tanstack/react-query";
import instance from "@/apis/instance";
import { useToast } from "@/hooks/useToast";

export default function VsJudge() {
  const { caseId } = useVsModeStore();
  const navigate = useNavigate();
  const { showError } = useToast();

  /* VS 모드 판결문 API */
  const { data: judgmentData } = useQuery({
    queryKey: ["vsJudgmentFinal", caseId],
    queryFn: async () => {
      const { data } = await instance.get(`/api/v1/cases/${caseId}/judgment`);
      return data;
    },
    enabled: !!caseId,
  });

  /* 사건 상세 조회 */
  const { data: detailData } = useQuery({
    queryKey: ["vsCaseDetail", caseId],
    queryFn: async () => {
      const { data } = await instance.get(`/api/v1/cases/${caseId}`);
      return data;
    },
    enabled: !!caseId,
  });

  const detail = detailData?.result;
  const judgment = judgmentData?.result;

  const title = detail?.title ?? "사건";
  const aMain = detail?.argumentA?.mainArgument ?? "A입장";
  const bMain = detail?.argumentB?.mainArgument ?? "B입장";

  const verdict = judgment?.verdict ?? "판결";
  const conclusion = judgment?.conclusion ?? "";
  const ratioA = Math.round(judgment?.ratioA ?? 50);
  const ratioB = Math.round(judgment?.ratioB ?? 50);

  const winnerMain = ratioA >= ratioB ? aMain : bMain;
  const winnerRatio = ratioA >= ratioB ? ratioA : ratioB;

  if (!detail || !judgment) {
    return (
      <div className="flex justify-center items-center min-h-screen px-4 text-main font-bold text-center">
        판결문을 불러오는 중입니다…
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center bg-white mx-auto w-full max-w-[1440px] px-4 md:px-[40px] min-h-screen pb-[100px] text-[#203C77] font-[Pretendard]">
      {/* 제목 */}
      <h1 className="text-[28px] md:text-[38px] font-bold text-center mt-10">
        초심 최종 판결
      </h1>

      {/* 파란 박스 */}
      <div className="relative w-full max-w-[995px] h-[480px] md:h-[634px] bg-[#6596DA] rounded-[30px] mt-10">
        {/* A vs B */}
        <div className="flex justify-center items-start pt-[40px] md:pt-[57px] gap-[24px] md:gap-[56px] text-white font-bold px-4 md:px-0">
          <p className="w-[45%] md:w-[300px] text-[20px] md:text-[28px] text-center leading-[150%] break-keep">
            {aMain}
          </p>
          <p className="text-[24px] md:text-[32px] leading-[150%]">VS</p>
          <p className="w-[45%] md:w-[300px] text-[20px] md:text-[28px] text-center leading-[150%] break-keep">
            {bMain}
          </p>
        </div>

        {/* 말풍선 */}
        <div className="absolute left-[20px] md:left-[57px] top-[140px] md:top-[162px]">
          <div className="relative w-[260px] md:w-[316px] h-[72px] md:h-[78px] bg-white rounded-[30px] shadow-sm flex justify-center items-center px-[28px] md:px-[55px] py-[16px] md:py-[21px]">
            <p className="text-black text-[14px] md:text-[16px] text-center leading-[150%]">
              <span className="font-semibold">{winnerMain}</span> 의견이{" "}
              <span className="font-semibold">{winnerRatio}%</span>로 더
              논리적입니다.
            </p>
            <div
              className="absolute left-[40px] md:left-[50px] bottom-[-20px] w-0 h-0 
              border-l-[20px] md:border-l-[24px] border-l-transparent 
              border-r-[20px] md:border-r-[24px] border-r-transparent 
              border-t-[24px] border-t-white"
            />
          </div>
        </div>

        <img
          src={judgeIllustrationUrl}
          alt="판사"
          className="absolute bottom-0 left-[10px] md:left-[30px] w-[260px] md:w-[410px] h-[244px] md:h-[385px]"
        />

        {/* 판결문 */}
        <div
          className="absolute top-[130px] md:top-[151px] right-[12px] md:right-[44px] 
          w-[320px] md:w-[496px] h-[420px] md:h-[513px] 
          bg-[#FFFFF6] rounded-[7px] flex flex-col items-center pt-[30px] text-[#EBAD27]"
        >
          <p className="absolute left-[20px] md:left-[39px] top-[20px] md:top-[29px] text-[12px] md:text-[14px] font-['Gapyeong_Hanseokbong']">
            사건번호 - {caseId}
          </p>

          <p className="absolute right-[20px] md:right-[45px] top-[18px] md:top-[26px] text-[12px] md:text-[14px] font-['Gapyeong_Hanseokbong']">
            AI 판사
          </p>

          <ScaleIcon
            className="absolute top-[20px] md:top-[24px] left-1/2 -translate-x-1/2 w-[40px] h-[40px] md:w-[48px] md:h-[48px]"
            title="AI 판결 저울"
          />

          <h2
            className="absolute top-[70px] md:top-[78px] left-1/2 -translate-x-1/2 
            text-[28px] md:text-[38px] font-bold text-[#EBAD27] text-center font-['Gapyeong_Hanseokbong']"
          >
            판결문
          </h2>

          <p className="absolute top-[130px] md:top-[150px] left-1/2 -translate-x-1/2 w-[280px] md:w-[420px] text-[12px] md:text-[13px] text-center font-['Gapyeong_Hanseokbong'] leading-[150%]">
            사건명: {title}
          </p>

          <p className="absolute top-[180px] md:top-[200px] left-1/2 -translate-x-1/2 w-[280px] md:w-[420px] text-[13px] md:text-[15px] text-center font-['Gapyeong_Hanseokbong'] leading-[150%]">
            {conclusion}
          </p>

          <p className="absolute top-[290px] md:top-[300px]  left-1/2 -translate-x-1/2 w-[280px] md:w-[420px] text-[13px] md:text-[15px] font-bold text-center font-['Gapyeong_Hanseokbong'] leading-[150%]">
            {verdict}
          </p>
        </div>
      </div>

      {/* 승률 박스 */}
      <div className="mt-[50px] md:mt-[70px] flex justify-center w-full">
        <div className="relative w-full max-w-[960px] h-[80px] md:h-[94px] bg-[#EAF1FD] rounded-[15px] flex justify-center items-center px-4 md:px-[32px] text-center shadow-sm">
          <p className="text-[#203C77] text-[16px] md:text-[20px] leading-[150%]">
            땅!땅!땅! 재판부는{" "}
            <span className="font-semibold">{winnerMain}</span>의 승리를
            선고합니다!
          </p>
          <div
            className="absolute left-[-20px] md:left-[-28px] top-1/2 -translate-y-1/2 
            w-0 h-0 border-t-[12px] md:border-t-[16px] border-t-transparent 
            border-b-[12px] md:border-b-[16px] border-b-transparent 
            border-r-[20px] md:border-r-[28px] border-r-[#EAF1FD]"
          />
        </div>
      </div>

      {/* A vs B 비율 */}
      <div className="mt-[28px] md:mt-[43px] flex justify-center w-full">
        <div className="relative w-full max-w-[995px] h-[40px] md:h-[44px] bg-[rgba(235,146,146,0.46)] rounded-[30px] overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-[#809AD2]"
            style={{ width: `${ratioA}%` }}
          />
          <div className="relative z-10 flex h-full justify-between items-center px-[12px] md:px-[20px]">
            <p className="text-white text-[14px] md:text-[16px] font-bold">
              {aMain} {ratioA}%
            </p>
            <p className="text-white text-[14px] md:text-[16px] font-bold">
              {bMain} {ratioB}%
            </p>
          </div>
        </div>
      </div>

      {/* 2차 재판 버튼 (중앙 정렬, 단독 버튼) */}
      <Button
        variant="trialStart"
        className="w-full max-w-[395px] h-[80px] md:h-[123px] mt-[32px] md:mt-[40px] text-[20px] md:text-[24px] font-semibold rounded-[24px] md:rounded-[30px]"
        onClick={() => {
          if (!caseId) {
            showError("케이스 ID가 없습니다.");
            return;
          }
          localStorage.setItem("lastCaseId", String(caseId));
          navigate(`${PATHS.SECOND_TRIAL_ROUND_ONE}/${caseId}`);
        }}
      >
        <span className="text-white text-[24px] md:text-[28px] font-bold leading-normal">
          2차 재판 신청하기
        </span>
      </Button>
    </div>
  );
}
