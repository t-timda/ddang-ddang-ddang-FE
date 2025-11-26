import FileIcon from "@/assets/svgs/file.svg?react";
import Button from "@/components/common/Button";
import { useFirstTrialStore } from "@/stores/firstTrialStore";

/* 초심 - 결과 페이지 */
export default function Result() {
  const { setStep } = useFirstTrialStore();

  return (
    <div className="flex flex-col items-center bg-white mx-auto w-full max-w-[1440px] min-h-[calc(100vh-98px)] text-[#203C77] font-[Pretendard] px-4 md:px-0">
      <h1 className="text-[28px] md:text-[38px] font-bold text-center mt-[40px] md:mt-[78px] leading-[150%]">
        초심
      </h1>

      <div className="flex flex-col items-center justify-center mt-[60px] md:mt-[100px] w-full max-w-[395px] h-[320px] md:h-[448px] rounded-[60px] md:rounded-[100px] bg-main-medium/20">
        <FileIcon
          className="w-[160px] h-[160px] md:w-[229px] md:h-[229px] mb-[16px] md:mb-[20px]"
          title="판결 완료 아이콘"
        />
        <p className="text-[24px] md:text-[36px] font-bold leading-tight text-center">
          판결 완료!
        </p>
      </div>

      <Button
        variant="trialStart"
        className="w-full max-w-[395px] h-[80px] md:h-[123px] mt-[32px] md:mt-[40px] mb-[80px] md:mb-[0px] text-[20px] md:text-[32px] font-semibold rounded-[24px] md:rounded-[30px]"
        onClick={() => setStep("judge")}
      >
        AI 판결 보기
      </Button>
    </div>
  );
}
