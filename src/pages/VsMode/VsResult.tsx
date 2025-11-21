import FileIcon from "@/assets/svgs/VsLoading.svg?react";
import Button from "@/components/common/Button";
import { useVsModeStore } from "@/stores/vsModeStore";

export default function VsResult() {
  const { setStep } = useVsModeStore();

  return (
    <div className="flex flex-col items-center bg-white mx-auto w-full max-w-[1440px] min-h-screen pb-[80px] text-[#203C77] font-[Pretendard]">
      <h1 className="text-[38px] font-bold text-center mt-[78px] leading-[150%]">
        초심
      </h1>

      <div className="flex flex-col items-center justify-center mt-[92px] w-[833px] h-[548px] rounded-[100px] bg-main-medium/20">
        <FileIcon
          className="w-[448px] h-[448px] mb-[4px]"
          title="판결 완료 아이콘"
        />
        <p className="text-[32px] font-bold leading-tight">판결 완료!</p>
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
