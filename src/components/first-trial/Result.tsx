import FileIcon from "@/assets/svgs/file.svg?react";
import Button from "@/components/common/Button";
import { useFirstTrialStore } from "@/stores/firstTrialStore";

/* 초심 - 결과 페이지 */
export default function Result() {
  const { setStep } = useFirstTrialStore();

  return (
    <div className="flex flex-col items-center bg-white mx-auto w-full max-w-[1440px] min-h-screen text-[#203C77] font-[Pretendard]">
      <h1 className="text-[38px] font-bold text-center mt-[78px] leading-[150%]">
        초심
      </h1>

      <div className="flex flex-col items-center justify-center mt-[100px] w-[395px] h-[448px] rounded-[100px] bg-main-medium/20">
        <FileIcon
          className="w-[229px] h-[229px] mb-[20px]"
          title="판결 완료 아이콘"
        />
        <p className="text-[36px] font-bold leading-tight">판결 완료!</p>
      </div>

      <Button
        variant="trialStart"
        className="w-[395px] h-[123px] mt-[40px] text-[24px] font-semibold rounded-[30px]"
        onClick={() => setStep("judge")}
      >
        AI 판결 보기
      </Button>
    </div>
  );
}
