import { useState } from "react";
import Button from "@/components/common/Button";
import { useFirstTrialStore } from "@/stores/firstTrialStore";

/* 초심 - 재판 시작 선택 페이지 */
export default function Start() {
  const { setStep } = useFirstTrialStore();

  const [selected, setSelected] = useState<"none" | "solo" | "vs">("none");

  const handleSoloClick = () => setSelected("solo");
  const handleVsClick = () => setSelected("vs");

  const handleStart = () => {
    if (selected === "solo") {
      setStep("submit");
    } else if (selected === "vs") {
      setStep("vsSubmit"); // VS 제출 페이지로 이동
    }
  };

  return (
    <div className="flex flex-col items-center bg-[#FFFFFF] mx-auto w-full max-w-[1440px] min-h-[calc(100vh-98px)] px-4 md:px-0">
      {/* 제목 */}
      <h1
        className="text-[28px] md:text-[38px] font-bold text-[#203C77] mt-[40px] md:mt-[78px] mb-[40px] md:mb-[60px] text-center"
        style={{ fontFamily: "Pretendard", lineHeight: "150%" }}
      >
        밸런스 재판 시작하기
      </h1>

      {/* 버튼 그룹 */}
      <div className="flex flex-col md:flex-row gap-[20px] md:gap-[40px] justify-center mb-[32px] md:mb-[40px] w-full max-w-[800px]">
        {/* 솔로모드 버튼 */}
        <Button
          variant="secondary"
          onClick={handleSoloClick}
          className={`w-full md:w-[380px] h-[80px] md:h-[123px] ${
            selected === "solo"
              ? "opacity-100"
              : selected === "vs"
              ? "opacity-40"
              : "opacity-100"
          }`}
        >
          솔로모드
        </Button>

        {/* VS모드 버튼 */}
        <Button
          variant="third"
          onClick={handleVsClick}
          className={`w-full md:w-[380px] h-[80px] md:h-[123px] ${
            selected === "vs"
              ? "opacity-100"
              : selected === "solo"
              ? "opacity-40"
              : "opacity-100"
          }`}
        >
          VS모드
        </Button>
      </div>

      {/* 솔로모드 설명 */}
      {selected === "solo" && (
        <div className="flex justify-center items-center text-center w-full max-w-[995px] min-h-[260px] md:min-h-[414px] bg-[#E8F2FF] rounded-[15px] px-6 py-8 md:px-[92px] md:py-[87px] mb-[40px] md:mb-[60px]">
          <p
            className="text-[16px] md:text-[20px] font-normal text-[#809AD2] leading-[150%]"
            style={{ fontFamily: "Pretendard" }}
          >
            솔로모드는 혼자서 밸런스 재판을 체험해보는 모드입니다. <br />
            상대방 없이 스스로 찬성과 반대 입장을 모두 작성하고, AI 판결을 통해
            결과를 확인할 수 있습니다. <br />
            제출된 내용은 외부에 공개되지 않으며, 오직 본인만 결과를 열람할 수
            있습니다.
          </p>
        </div>
      )}

      {/* VS모드 설명 */}
      {selected === "vs" && (
        <div className="flex justify-center items-center text-center w-full max-w-[995px] min-h-[260px] md:min-h-[414px] bg-[#E8F2FF] rounded-[15px] px-6 py-8 md:px-[92px] md:py-[87px] mb-[40px] md:mb-[60px]">
          <p
            className="text-[16px] md:text-[20px] font-normal text-[#809AD2] leading-[150%]"
            style={{ fontFamily: "Pretendard" }}
          >
            VS모드는 <b>두 명이 참여하는 대결 모드</b>입니다. <br />
            각자 A측 / B측을 선택해 자신의 논리를 작성하고, <br />
            AI 판사가 공정하게 판결을 내립니다. <br />
            실제 논쟁처럼 상대방과의 논리 싸움을 경험할 수 있는 모드입니다!
          </p>
        </div>
      )}

      {/* 재판 시작 버튼 */}
      {selected !== "none" && (
        <Button
          variant="trialStart"
          className="w-full md:w-[380px] h-[80px] md:h-[123px] px-6 md:px-[92px] py-4 md:py-[40px] mt-[24px] md:mt-[40px] mb-[60px] md:mb-[120px]"
          onClick={handleStart}
        >
          재판 시작하기
        </Button>
      )}
    </div>
  );
}
