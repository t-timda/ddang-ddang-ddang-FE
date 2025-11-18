import { useEffect } from "react";
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
    <div className="flex flex-col items-center bg-white mx-auto w-full max-w-[1440px] min-h-screen text-[#203C77] font-[Pretendard]">
      <h1 className="text-[38px] font-bold text-center mt-[78px] leading-relaxed">
        초심
      </h1>

      <div className="flex flex-col items-center justify-center ...[100px] w-[395px] h-[448px] rounded-[100px] bg-main-medium/20">
        <FileIcon
          className="w-[229px] h-[229px] mb-[20px]"
          title="입장문 제출중 아이콘"
        />
        <p className="text-[36px] font-bold leading-tight">입장문 제출중..</p>
      </div>
    </div>
  );
}
