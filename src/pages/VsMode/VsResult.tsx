import FileIcon from "@/assets/svgs/VsLoading.svg?react";
import Button from "@/components/common/Button";
import { useVsModeStore } from "@/stores/vsModeStore";

export default function VsResult() {
  const { setStep } = useVsModeStore();

  return (
    <div className="flex flex-col items-center bg-white mx-auto w-full max-w-[1440px] min-h-[calc(100vh-98px)] pb-[80px] text-[#203C77] font-[Pretendard] px-4 md:px-0">
      <h1 className="text-[28px] md:text-[38px] font-bold text-center mt-[40px] md:mt-[78px] leading-[150%]">
        초심
      </h1>

      <div className="flex flex-col items-center justify-center mt-[60px] md:mt-[92px] w-full max-w-[833px] h-[360px] md:h-[548px] rounded-[60px] md:rounded-[100px] bg-main-medium/20">
        <FileIcon
          className="w-[260px] h-[260px] md:w-[448px] md:h-[448px] mb-[4px]"
          title="판결 완료 아이콘"
        />
        <p className="text-[24px] md:text-[32px] font-bold leading-tight text-center">
          판결 완료!
        </p>
      </div>

      <Button
        variant="trialStart"
        className="w-full max-w-[395px] h-[80px] md:h-[123px] mt-[32px] md:mt-[40px] text-[20px] md:text-[24px] font-semibold rounded-[24px] md:rounded-[30px]"
        onClick={() => setStep("judge")}
      >
        AI 판결 보기
      </Button>
    </div>
  );
}
