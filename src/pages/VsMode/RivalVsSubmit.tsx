import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/common/Button";
import Textarea from "@/components/common/textarea";
import { PATHS } from "@/constants";
import { mockWaitingCases } from "@/mock/vsModeData";
import { useVsModeStore } from "@/stores/vsModeStore";

export default function RSubmit() {
  const navigate = useNavigate();
  const { caseId, setStep } = useVsModeStore();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // TODO: API 연결 시 useFirstCaseDetailQuery(caseId) 사용
  const caseDetail = mockWaitingCases.find((c) => c.caseId === caseId);

  const handleSubmit = () => {
    setIsModalOpen(true);
  };

  const handleProceed = () => {
    setIsModalOpen(false);
    setStep("loading"); // loading으로 step 변경
  };

  const handleCancel = () => {
    navigate(PATHS.ROOT);
  };

  if (!caseDetail) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-main-red font-bold text-xl">
          재판 정보를 불러올 수 없습니다
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen font-[Pretendard] text-[#203C77]">
      {/* 상단 */}
      <div className="flex items-center justify-between w-[995px] mt-[60px]">
        <h1 className="text-[38px] font-bold text-center flex-1">초심</h1>
        <div className="bg-[#EB9292] text-white px-4 py-2 rounded-[15px] text-[18px]">
          VS모드
        </div>
      </div>

      {/* 상황 설명 */}
      <div className="mt-[40px] w-[995px] h-[96px] bg-[#E8F2FF] rounded-[15px] flex items-center px-[56px]">
        <p className="text-[20px] text-[#203C77]">
          {caseDetail.title}
        </p>
      </div>

      {/* 상대 입장 */}
      <div className="mt-[60px] w-[995px]">
        <h2 className="text-[24px] font-bold mb-[15px]">상대 입장</h2>

        <div className="bg-[#D4E4FF] h-[96px] rounded-[15px] mb-[20px] flex items-center px-[56px]">
          <p className="text-[20px] text-[#203C77]">
            {caseDetail.argumentAMain}
          </p>
        </div>

        <div className="bg-[#D4E4FF] h-[259px] rounded-[15px] flex items-start px-[56px] pt-[34px]">
          <p className="text-[20px] text-[#203C77] leading-[1.6]">
            {caseDetail.argumentAReasoning}
          </p>
        </div>
      </div>

      {/* 내 입장 */}
      <div className="mt-[60px] w-[995px]">
        <h2 className="text-[24px] font-bold mb-[15px]">내 입장</h2>

        <div className="bg-[#E8F2FF] h-[96px] rounded-[15px] mb-[20px] flex items-center px-[56px]">
          <Textarea
            placeholder="입장을 작성해주세요."
            className="bg-[#E8F2FF] border-none text-[20px] w-full h-full resize-none outline-none placeholder-[#809AD2]"
          />
        </div>

        <div className="bg-[#E8F2FF] h-[259px] rounded-[15px] flex items-start px-[56px] pt-[34px]">
          <Textarea
            placeholder="입장을 뒷받침하는 논리적인 근거를 작성해주세요."
            className="bg-[#E8F2FF] border-none text-[20px] w-full resize-none outline-none placeholder-[#809AD2] leading-[1.6]"
          />
        </div>
      </div>

      {/* 안내 문구 */}
      <div className="mt-[80px] h-[32px] text-center">
        <p className="text-[24px] text-[#809AD2]">
          제출 후에는 의견 수정이 불가능합니다
        </p>
      </div>

      {/* 제출 버튼 */}
      <div className="mt-[12px] mb-[120px]">
        <Button
          variant="trialStart"
          size="lg"
          className="w-[380px] h-[123px] text-[36px] font-bold rounded-[15px]"
          onClick={handleSubmit}
        >
          상대의견 기다리기
        </Button>
      </div>

      {/* =================== 모달 =================== */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: "rgba(255, 255, 255, 0.39)" }}
        >
          {/* 회색 그림자 박스 */}
          <div
            className="absolute"
            style={{
              width: "646px",
              height: "322px",
              borderRadius: "17.847px",
              background: "#B2B2B2",
              transform: "translate(-0.5px, 6px)",
            }}
          />

          {/* 안쪽 메인 박스 */}
          <div
            className="relative flex flex-col items-center justify-center"
            style={{
              width: "634px",
              height: "294px",
              borderRadius: "14.872px",
              background: "#FFFFFF",
            }}
          >
            <p
              className="text-center mb-[24px]"
              style={{
                color: "#203C77",
                fontFamily: "Pretendard",
                fontSize: "20px",
                fontWeight: 700,
                lineHeight: "150%",
                whiteSpace: "pre-line",
              }}
            >
              VS 모드에서는 1차 재판이 매칭되어 진행될 경우,
              {"\n"}자동으로 2차 재판도 이어서 진행됩니다.
              {"\n"}계속하시겠습니까?
            </p>

            {/* 버튼 2개 */}
            <div className="flex items-center justify-center gap-[49px]">
              {/* 취소 버튼 */}
              <button
                onClick={handleCancel}
                className="transition-all duration-150"
                style={{
                  width: "200px",
                  height: "70px",
                  borderRadius: "15px",
                  fontFamily: "Pretendard",
                  fontSize: "26px",
                  fontWeight: 700,
                  color: "#FFFFFF",
                  background: "#AFC5F8",
                  boxShadow: "0px 6px 0px #8FADE8",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.85";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = "translateY(4px)";
                  e.currentTarget.style.boxShadow = "0px 2px 0px #8FADE8";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = "translateY(0px)";
                  e.currentTarget.style.boxShadow = "0px 6px 0px #8FADE8";
                }}
              >
                취소
              </button>

              {/* 계속 진행하기 버튼 */}
              <button
                onClick={handleProceed}
                className="transition-all duration-150"
                style={{
                  width: "200px",
                  height: "70px",
                  borderRadius: "15px",
                  fontFamily: "Pretendard",
                  fontSize: "26px",
                  fontWeight: 700,
                  color: "#FFFFFF",
                  background: "#2E4C8F",
                  boxShadow: "0px 6px 0px #1C356B",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.85";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = "translateY(4px)";
                  e.currentTarget.style.boxShadow = "0px 2px 0px #1C356B";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = "translateY(0px)";
                  e.currentTarget.style.boxShadow = "0px 6px 0px #1C356B";
                }}
              >
                계속 진행하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
