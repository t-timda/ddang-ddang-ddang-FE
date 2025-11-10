import Button from "@/components/common/Button";
import JudgeIcon from "@/assets/svgs/FirstJudge.svg";
import ScaleIcon from "@/assets/svgs/Scale.svg";
import { useThirdTrialStore } from "@/stores/thirdTrialStore";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Verdict() {
  const navigate = useNavigate();
  const reset = useThirdTrialStore((s) => s.reset);
  
  return (
    <div className="flex flex-col items-center bg-white mx-auto w-full max-w-[1440px] min-h-screen pb-[100px] text-[#203C77] font-[Pretendard]">
      {/* 제목 */}
      <h1 className="text-[38px] font-bold text-center mt-[84px] leading-[150%]">
        최종 판결
      </h1>

      {/* 파란 박스 */}
      <div className="relative w-[995px] h-[634px] bg-[#6596DA] rounded-[30px] mt-[84px]">
        {/* A입장 / VS / B입장 */}
        <div className="flex justify-center items-center pt-[57px] gap-[82px] text-white text-[38px] font-bold leading-[150%]">
          <p>A입장</p>
          <p>VS</p>
          <p>B입장</p>
        </div>

        {/* 말풍선 */}
        <div className="absolute left-[57px] top-[162px]">
          <div className="relative">
            <div className="relative w-[316px] h-[78px] bg-white rounded-[30px] shadow-sm flex justify-center items-center px-[55px] py-[21px]">
              <p className="text-black text-[24px] font-normal leading-[150%] text-center">
                더 논리적이었던 건 A!
              </p>

              <div
                className="absolute left-[50px] bottom-[-20px] w-0 h-0
                           border-l-[24px] border-l-transparent 
                           border-r-[24px] border-r-transparent 
                           border-t-[24px] border-t-white"
              ></div>
            </div>
          </div>
        </div>

        {/* 판사 이미지 */}
        <JudgeIcon className="absolute bottom-0 left-[30px] w-[410px] h-[385px]" />

      {/* 판결문 노란 상자 */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-[151px] right-[44px] w-[496px] h-[513px] bg-[#FFFFF6] rounded-[7px] flex flex-col items-center pt-[30px] text-[#EBAD27]"
      >
          <p className="absolute left-[39px] top-[29px] text-[14px] leading-[150%] font-['Gapyeong_Hanseokbong']">
            사건번호 - 01
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
            배경: 어쩌고저쩌고
            <br />
            A입장: 어쩌고저쩌고
            <br />
            B입장: 어쩌고저쩌고
          </p>

          <p className="absolute top-[249px] left-1/2 -translate-x-1/2 w-[420px] text-[15px] leading-[150%] text-center text-[#EBAD27] font-normal font-['Gapyeong_Hanseokbong']">
            A입장의 어쩌고 저쩌고 근거가 더 배경설명과 주제를 납득 어쩌고 저쩌고
            <br />
            B입장의 해당 근거는 어쩌고저쩌고이지만 어쩌고 저쩌고 해서 A가 더
            어쩌고 저쩌고 해서
            <br />
            어쩌고 저쩌고 해서 어쩌고 저쩌고 해서 어쩌고 저쩌고 해서 어쩌고
            저쩌고 해서
          </p>

          <p className="absolute top-[403px] left-1/2 -translate-x-1/2 w-[420px] text-[15px] font-bold leading-[150%] text-center text-[#EBAD27] font-['Gapyeong_Hanseokbong']">
            A입장 논리의 승리! B입장은 불복할 시 재심을 청구할 수 있음
          </p>
        </motion.div>
      </div>

      {/* 하단 말풍선 */}
      <div className="mt-[60px] flex justify-center">
        <div className="relative w-[960px] h-[94px] bg-[#EAF1FD] rounded-[15px] flex justify-center items-center px-[32px] text-center shadow-sm">
          <p className="text-[#203C77] text-[20px] font-normal leading-[150%]">
            A 입장의 근거가 B 입장의 근거에 비해 n%정도 더 논리적이었어요!
          </p>

          <div
            className="absolute left-[-28px] top-1/2 -translate-y-1/2 w-0 h-0 
                       border-t-[16px] border-t-transparent 
                       border-b-[16px] border-b-transparent 
                       border-r-[28px] border-r-[#EAF1FD]"
          ></div>
        </div>
      </div>

      {/* 파란/빨간 바 */}
      <div className="mt-[43px] flex justify-center">
        <div className="relative w-[995px] h-[44px] bg-[rgba(235,146,146,0.46)] rounded-[30px] overflow-hidden flex items-center justify-between px-[20px]">
          <div
            className="absolute left-0 top-0 h-full bg-[#809AD2] rounded-[30px]"
            style={{ width: "60%" }}
          ></div>

          <div className="relative z-10 flex w-full justify-between items-center px-[20px]">
            <p className="text-white text-[16px] font-bold leading-[150%]">
              A입장 n%
            </p>
            <p className="text-white text-[16px] font-bold leading-[150%]">
              B입장 n%
            </p>
          </div>
        </div>
      </div>

      {/* 하단 버튼 2개 */}
      <div className="mt-[84px] flex justify-center gap-[32px]">
        {/* 여기서 마치기 → 홈으로 */}
        <Button onClick={() => {reset(); navigate('/');}}>홈으로</Button>
      </div>
    </div>
  );
}
