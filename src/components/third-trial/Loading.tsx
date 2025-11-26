import { useEffect } from "react";
import { motion } from "framer-motion";
import FileIcon from "@/assets/svgs/file.svg?react";
import { useThirdTrialStore } from "@/stores/thirdTrialStore";
import { useThirdJudgmentQuery } from "@/hooks/thirdTrial/useThirdTrial";

export default function Loading() {
  const setStep = useThirdTrialStore((s) => s.setStep);
  const caseId = useThirdTrialStore((s) => s.caseId);

  // 3차 재판 판결 조회 (3초마다 폴링)
  const { data: judgmentData, isSuccess } = useThirdJudgmentQuery(
    caseId ?? undefined,
    3000
  );

  useEffect(() => {
    // 판결 데이터가 성공적으로 로드되면 verdict 화면으로 이동
    if (isSuccess && judgmentData?.result) {
      const timer = setTimeout(() => {
        setStep("verdict");
      }, 3000); // 최소 3초 대기
      return () => clearTimeout(timer);
    }
  }, [isSuccess, judgmentData, setStep]);

  return (
    <div className="flex flex-col items-center bg-white mx-auto w-full max-w-[1440px] min-h-[calc(100vh-98px)] text-[#203C77] font-[Pretendard] px-4 md:px-0">
      <h1 className="text-[28px] md:text-[38px] font-bold text-center mt-[40px] md:mt-[78px] leading-relaxed">
        최종심
      </h1>

      <div className="flex flex-col items-center justify-center mt-[60px] md:mt-[100px] w-full max-w-[395px] h-[320px] md:h-[448px] rounded-[60px] md:rounded-[100px] bg-main-medium/20 overflow-hidden relative">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 1,
            ease: "easeOut",
            repeat: Infinity,
            repeatType: "loop",
            repeatDelay: 0.5,
          }}
          className="flex flex-col items-center"
        >
          <FileIcon
            className="w-[160px] h-[160px] md:w-[229px] md:h-[229px] mb-[16px] md:mb-[20px]"
            title="입장문 제출중 아이콘"
          />
          <p className="text-[24px] md:text-[36px] font-bold leading-tight text-center">
            입장문 제출중..
          </p>
        </motion.div>
      </div>
    </div>
  );
}
