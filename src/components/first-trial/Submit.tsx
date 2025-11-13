import { useState } from "react";
import Button from "@/components/common/Button";
import Textarea from "@/components/common/textarea";
import { useFirstTrialStore } from "@/stores/firstTrialStore";

/* 입장문 제출 페이지 */
export default function Submit() {
  const [selectedSide, setSelectedSide] = useState<"A" | "B" | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const { setStep } = useFirstTrialStore();

  const handleSelect = (side: "A" | "B") => {
    if (selectedSide === side) {
      setSelectedSide(null);
      return;
    }
    setSelectedSide(side);
    setErrorMessage("");
  };

  const handleSubmit = () => {
    if (!selectedSide) {
      setErrorMessage("입장을 선택해주세요");
      return;
    }
    setStep("loading");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen font-[Pretendard] text-[#203C77]">
      {/* 상단 제목 + 솔로모드 표시 */}
      <div className="flex items-center justify-between w-[995px] mt-[60px]">
        <h1 className="text-[38px] font-bold text-center flex-1">초심</h1>
        <div className="bg-[#809AD2] text-white px-4 py-2 rounded-[15px] text-[18px] font-normal">
          솔로모드
        </div>
      </div>

      {/* 밸런스 게임 상황 설명 */}
      <div className="mt-[40px] w-[995px] h-[96px] bg-[#E8F2FF] rounded-[15px] flex items-center px-[56px]">
        <Textarea
          placeholder="밸런스 게임의 배경 상황을 설명해주세요."
          className="bg-[#E8F2FF] border-none text-[20px] text-[#203C77] w-full h-full resize-none outline-none placeholder-[#809AD2] font-normal"
        />
      </div>

      {/* A측 */}
      <div className="mt-[60px] w-[995px]">
        <h2 className="text-[24px] font-bold mb-[15px]">A측 입장</h2>

        {/* 입장 박스 */}
        <div className="bg-[#E8F2FF] h-[96px] rounded-[15px] mb-[20px] flex items-center px-[56px]">
          <Textarea
            placeholder="입장을 작성해주세요."
            className="bg-[#E8F2FF] border-none text-[20px] text-[#203C77] w-full h-full resize-none outline-none placeholder-[#809AD2] font-normal"
          />
        </div>

        {/* 근거 박스 */}
        <div className="bg-[#E8F2FF] h-[259px] rounded-[15px] flex items-start px-[56px] pt-[34px] pb-[201px]">
          <Textarea
            placeholder="입장을 뒷받침하는 논리적인 근거를 작성해주세요."
            className="bg-[#E8F2FF] border-none text-[20px] text-[#203C77] w-full resize-none outline-none placeholder-[#809AD2] font-normal leading-[1.6]"
          />
        </div>
      </div>

      {/* B측 */}
      <div className="mt-[60px] w-[995px]">
        <h2 className="text-[24px] font-bold mb-[15px]">B측 입장</h2>

        {/* 입장 박스 */}
        <div className="bg-[#E8F2FF] h-[96px] rounded-[15px] mb-[20px] flex items-center px-[56px]">
          <Textarea
            placeholder="입장을 작성해주세요."
            className="bg-[#E8F2FF] border-none text-[20px] text-[#203C77] w-full h-full resize-none outline-none placeholder-[#809AD2] font-normal"
          />
        </div>

        {/* 근거 박스 */}
        <div className="bg-[#E8F2FF] h-[259px] rounded-[15px] flex items-start px-[56px] pt-[34px] pb-[201px]">
          <Textarea
            placeholder="입장을 뒷받침하는 논리적인 근거를 작성해주세요."
            className="bg-[#E8F2FF] border-none text-[20px] text-[#203C77] w-full resize-none outline-none placeholder-[#809AD2] font-normal leading-[1.6]"
          />
        </div>
      </div>

      {/* A/B 버튼 + VS */}
      <div className="flex items-center justify-center mt-[72px] gap-[42px]">
        <Button
          variant="secondary"
          size="lg"
          className={`w-[373px] h-[96px] text-[24px] font-semibold leading-none rounded-[15px] transition-all duration-200 ${
            selectedSide === "B" ? "opacity-60" : "opacity-100"
          }`}
          onClick={() => handleSelect("A")}
        >
          A측 입장
        </Button>

        <p className="text-[36px] font-bold text-[#203C77]">VS</p>

        <Button
          variant="third"
          size="lg"
          className={`w-[373px] h-[96px] text-[24px] font-semibold leading-none rounded-[15px] transition-all duration-200 ${
            selectedSide === "A" ? "opacity-60" : "opacity-100"
          }`}
          onClick={() => handleSelect("B")}
        >
          B측 입장
        </Button>
      </div>

      {/* 에러 or 안내 문구 */}
      <div className="mt-[64px] h-[32px] text-center">
        {errorMessage ? (
          <p className="text-[24px] text-[#809AD2] font-normal">
            {errorMessage}
          </p>
        ) : (
          <p className="text-[24px] text-[#809AD2] font-normal">
            제출후에는 의견 수정이 불가능합니다
          </p>
        )}
      </div>

      {/* 제출 버튼 */}
      <div className="mt-[29px] mb-[120px]">
        <Button
          variant="trialStart"
          size="lg"
          className="w-[380px] h-[123px] text-[36px] font-bold rounded-[15px]"
          onClick={handleSubmit}
        >
          제출하고 재판하기
        </Button>
      </div>
    </div>
  );
}
