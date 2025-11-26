import { useEffect } from "react";
import { motion } from "framer-motion";
import FileIcon from "@/assets/svgs/file.svg?react";
import { useFirstTrialStore } from "@/stores/firstTrialStore";
import { useFirstJudgmentQuery } from "@/hooks/firstTrial/useFirstTrial";

export default function Loading() {
  const { setStep, caseId } = useFirstTrialStore();

  // 실제 판결 완료 폴링으로 전환
  const { data } = useFirstJudgmentQuery(caseId ?? undefined, 1200);

  useEffect(() => {
    if (data?.isSuccess) setStep("result");
  }, [data, setStep]);

  return (
    <div className="flex flex-col items-center bg-white mx-auto w-full max-w-[1440px] min-h-[calc(100vh-98px)] text-[#203C77] font-[Pretendard] px-4 md:px-0">
      <h1 className="text-[28px] md:text-[38px] font-bold text-center mt-[40px] md:mt-[78px] leading-relaxed">
        초심
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
