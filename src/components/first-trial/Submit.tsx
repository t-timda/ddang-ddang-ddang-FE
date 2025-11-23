import { useState } from "react";
import Button from "@/components/common/Button";
import Textarea from "@/components/common/textarea";
import { useFirstTrialStore } from "@/stores/firstTrialStore";
import { isAxiosError } from "axios";
import { useCreateFirstCaseMutation } from "@/hooks/firstTrial/useFirstTrial";

export default function Submit() {
  const [selectedSide, setSelectedSide] = useState<"A" | "B" | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const { setStep, setCaseId } = useFirstTrialStore();

  const [title, setTitle] = useState("");
  const [aMain, setAMain] = useState("");
  const [aReason, setAReason] = useState("");
  const [bMain, setBMain] = useState("");
  const [bReason, setBReason] = useState("");

  const createMut = useCreateFirstCaseMutation();

  const handleSelect = (side: "A" | "B") => {
    if (selectedSide === side) {
      setSelectedSide(null);
      return;
    }
    setSelectedSide(side);
    setErrorMessage("");
  };

  const handleSubmit = async () => {
    if (!selectedSide) {
      setErrorMessage("입장을 선택해주세요");
      return;
    }
    if (!title || !aMain || !aReason || !bMain || !bReason) {
      setErrorMessage("모든 내용을 입력해주세요");
      return;
    }

    try {
      const res = await createMut.mutateAsync({
        mode: "SOLO",
        title,
        argumentAMain: aMain,
        argumentAReasoning: aReason,
        argumentBMain: bMain,
        argumentBReasoning: bReason,
      });

      const id = res.result?.caseId ?? null;
      if (!id) throw new Error("caseId가 없습니다");
      setCaseId(id);
      setStep("loading");
    } catch (e) {
      const msg = isAxiosError(e)
        ? e.response?.data?.message || e.message
        : e instanceof Error
        ? e.message
        : "제출에 실패했습니다.";
      setErrorMessage(msg);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-[#FFFFFF] font-[Pretendard] text-[#203C77] px-4 md:px-0">
      <div className="flex items-center justify-between w-full max-w-[995px] mt-[40px] md:mt-[60px]">
        <h1 className="text-[28px] md:text-[38px] font-bold text-center flex-1">
          초심
        </h1>
        <div className="bg-[#809AD2] text-white px-4 py-2 rounded-[15px] text-[16px] md:text-[18px]">
          솔로모드
        </div>
      </div>

      {/* 배경 상황 */}
      <div className="mt-[32px] md:mt-[40px] w-full max-w-[995px] h-auto md:h-[96px] bg-[#E8F2FF] rounded-[15px] flex items-center px-4 md:px-[56px]">
        <Textarea
          placeholder="밸런스 게임의 배경 상황을 설명해주세요."
          className="bg-[#E8F2FF] border-none text-[16px] md:text-[20px] text-[#203C77] w-full h-full resize-none outline-none placeholder-[#809AD2]"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* A/B 선택 버튼 */}
      <div className="flex flex-col md:flex-row items-center justify-center mt-[40px] md:mt-[60px] gap-[16px] md:gap-[42px] w-full max-w-[995px]">
        <Button
          variant="secondary"
          size="lg"
          className={`w-full md:w-[373px] h-[72px] md:h-[96px] text-[20px] md:text-[24px] font-semibold rounded-[15px] ${
            selectedSide === "B" ? "opacity-60" : "opacity-100"
          }`}
          onClick={() => handleSelect("A")}
        >
          A측 입장
        </Button>
        <p className="text-[28px] md:text-[36px] font-bold text-[#203C77]">
          VS
        </p>
        <Button
          variant="third"
          size="lg"
          className={`w-full md:w-[373px] h-[72px] md:h-[96px] text-[20px] md:text-[24px] font-semibold rounded-[15px] ${
            selectedSide === "A" ? "opacity-60" : "opacity-100"
          }`}
          onClick={() => handleSelect("B")}
        >
          B측 입장
        </Button>
      </div>

      {/* 선택된 입장에 따라 A/B 입력 UI가 조건부 렌더링 */}
      {selectedSide === "A" && (
        <div className="mt-[40px] md:mt-[60px] w-full max-w-[995px]">
          <h2 className="text-[20px] md:text-[24px] font-bold mb-[12px] md:mb-[15px]">
            A측 입장
          </h2>

          <div className="bg-[#E8F2FF] h-auto md:h-[96px] rounded-[15px] mb-[16px] md:mb-[20px] flex items-center px-4 md:px-[56px]">
            <Textarea
              placeholder="입장을 작성해주세요."
              className="bg-[#E8F2FF] border-none text-[16px] md:text-[20px] text-[#203C77] w-full h-full resize-none outline-none"
              value={aMain}
              onChange={(e) => setAMain(e.target.value)}
            />
          </div>

          <div className="bg-[#E8F2FF] h-auto md:h-[259px] rounded-[15px] flex items-start px-4 md:px-[56px] pt-[24px] md:pt-[34px] pb-[24px]">
            <Textarea
              placeholder="입장을 뒷받침하는 논리적인 근거를 작성해주세요."
              className="bg-[#E8F2FF] border-none text-[16px] md:text-[20px] text-[#203C77] w-full resize-none outline-none leading-[1.6]"
              value={aReason}
              onChange={(e) => setAReason(e.target.value)}
            />
          </div>
        </div>
      )}

      {selectedSide === "B" && (
        <div className="mt-[40px] md:mt-[60px] w-full max-w-[995px]">
          <h2 className="text-[20px] md:text-[24px] font-bold mb-[12px] md:mb-[15px]">
            B측 입장
          </h2>

          <div className="bg-[#E8F2FF] h-auto md:h-[96px] rounded-[15px] mb-[16px] md:mb-[20px] flex items-center px-4 md:px-[56px]">
            <Textarea
              placeholder="입장을 작성해주세요."
              className="bg-[#E8F2FF] border-none text-[16px] md:text-[20px] text-[#203C77] w-full h-full resize-none outline-none"
              value={bMain}
              onChange={(e) => setBMain(e.target.value)}
            />
          </div>

          <div className="bg-[#E8F2FF] h-auto md:h-[259px] rounded-[15px] flex items-start px-4 md:px-[56px] pt-[24px] md:pt-[34px] pb-[24px]">
            <Textarea
              placeholder="입장을 뒷받침하는 논리적인 근거를 작성해주세요."
              className="bg-[#E8F2FF] border-none text-[16px] md:text-[20px] text-[#203C77] w-full resize-none outline-none leading-[1.6]"
              value={bReason}
              onChange={(e) => setBReason(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* 안내/에러 */}
      <div className="mt-[48px] md:mt-[64px] h-[32px] text-center px-4">
        {errorMessage ? (
          <p className="text-[18px] md:text-[24px] text-[#809AD2]">
            {errorMessage}
          </p>
        ) : (
          <p className="text-[18px] md:text-[24px] text-[#809AD2]">
            제출후에는 의견 수정이 불가능합니다
          </p>
        )}
      </div>

      {/* 제출 */}
      <div className="mt-[24px] md:mt-[29px] mb-[80px] md:mb-[120px] w-full flex justify-center">
        <Button
          variant="trialStart"
          size="lg"
          className="w-full max-w-[380px] h-[72px] md:h-[123px] text-[24px] md:text-[36px] font-bold rounded-[15px]"
          onClick={handleSubmit}
          disabled={createMut.isPending}
        >
          {createMut.isPending ? "제출중..." : "제출하고 재판하기"}
        </Button>
      </div>
    </div>
  );
}
