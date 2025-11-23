import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/common/Button";
import Textarea from "@/components/common/textarea";
import { PATHS } from "@/constants";
import { firstTrialApi } from "@/apis/firstTrial/firstTrialApi";

export default function VsSubmit() {
  const navigate = useNavigate();

  const [situation, setSituation] = useState("");
  const [mainArgument, setMainArgument] = useState("");
  const [reasoning, setReasoning] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!situation.trim() || !mainArgument.trim() || !reasoning.trim()) {
      alert("모든 내용을 입력해주세요!");
      return;
    }

    setIsModalOpen(true);
  };

  const handleProceed = async () => {
    setIsModalOpen(false);

    try {
      setIsSubmitting(true);

      // vs모드 party 사용
      const res = await firstTrialApi.postFirstTrialCreate({
        mode: "PARTY",
        title: situation,
        argumentAMain: mainArgument,
        argumentAReasoning: reasoning,
        // B측은 더미값으로 자리 확보
        argumentBMain: "VS_WAITING",
        argumentBReasoning: "VS_WAITING",
      });

      console.log(res);

      // 성공 → 메인페이지로 이동
      navigate(PATHS.ROOT);
    } catch (err) {
      console.error(err);
      alert("VS 모드 재판 생성 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(PATHS.ROOT);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full max-w-[1440px] mx-auto bg-[#FFFFFF] font-[Pretendard] text-[#203C77] px-4 md:px-0">
      {/* 상단 */}
      <div className="flex items-center justify-between w-full max-w-[995px] mt-[40px] md:mt-[60px]">
        <h1 className="text-[28px] md:text-[38px] font-bold text-center flex-1">
          초심
        </h1>
        <div className="bg-[#EB9292] text-white px-4 py-2 rounded-[15px] text-[16px] md:text-[18px]">
          VS모드
        </div>
      </div>

      {/* 상황 설명 */}
      <div className="mt-[32px] md:mt-[40px] w-full max-w-[995px] h-auto md:h-[96px] bg-[#E8F2FF] rounded-[15px] flex items-center px-4 md:px-[56px]">
        <Textarea
          placeholder="밸런스 게임의 배경 상황을 설명해주세요."
          className="bg-[#E8F2FF] border-none text-[16px] md:text-[20px] w-full h-full resize-none outline-none placeholder-[#809AD2]"
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
        />
      </div>

      {/* 입장 */}
      <div className="mt-[40px] md:mt-[60px] w-full max-w-[995px]">
        <h2 className="text-[20px] md:text-[24px] font-bold mb-[12px] md:mb-[15px]">
          내 입장
        </h2>

        <div className="bg-[#E8F2FF] h-auto md:h-[96px] rounded-[15px] mb-[16px] md:mb-[20px] flex items-center px-4 md:px-[56px]">
          <Textarea
            placeholder="입장을 작성해주세요."
            className="bg-[#E8F2FF] border-none text-[16px] md:text-[20px] w-full h-full resize-none outline-none placeholder-[#809AD2]"
            value={mainArgument}
            onChange={(e) => setMainArgument(e.target.value)}
          />
        </div>

        <div className="bg-[#E8F2FF] h-auto md:h-[259px] rounded-[15px] flex items-start px-4 md:px-[56px] pt-[24px] md:pt-[34px] pb-[24px]">
          <Textarea
            placeholder="입장을 뒷받침하는 논리적인 근거를 작성해주세요."
            className="bg-[#E8F2FF] border-none text-[16px] md:text-[20px] w-full resize-none outline-none placeholder-[#809AD2] leading-[1.6]"
            value={reasoning}
            onChange={(e) => setReasoning(e.target.value)}
          />
        </div>
      </div>

      {/* 안내 문구 */}
      <div className="mt-[60px] md:mt-[80px] h-[32px] text-center px-4">
        <p className="text-[18px] md:text-[24px] text-[#809AD2]">
          제출 후에는 의견 수정이 불가능합니다
        </p>
      </div>

      {/* 제출 버튼 */}
      <div className="mt-[12px] mb-[80px] md:mb-[120px] w-full flex justify-center">
        <Button
          variant="trialStart"
          size="lg"
          className="w-full max-w-[380px] h-[72px] md:h-[123px] text-[24px] md:text-[36px] font-bold rounded-[15px]"
          onClick={handleSubmit}
          disabled={isSubmitting}
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
          {/* 회색 그림자 */}
          <div
            className="absolute"
            style={{
              width: "min(646px, 95%)",
              height: "322px",
              borderRadius: "17.847px",
              background: "#B2B2B2",
              transform: "translate(-0.5px, 6px)",
            }}
          />

          {/* 메인 박스 */}
          <div
            className="relative flex flex-col items-center justify-center px-6"
            style={{
              width: "min(634px, 90%)",
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
                fontSize: "18px",
                fontWeight: 700,
                lineHeight: "150%",
                whiteSpace: "pre-line",
              }}
            >
              VS 모드에서는 1차 재판이 매칭되어 진행될 경우,
              {"\n"}자동으로 2차 재판도 이어서 진행됩니다.
              {"\n"}계속하시겠습니까?
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-[16px] sm:gap-[49px] w-full">
              {/* 취소 */}
              <button
                onClick={handleCancel}
                className="transition-all duration-150 w-full sm:w-[200px]"
                style={{
                  height: "70px",
                  borderRadius: "15px",
                  fontFamily: "Pretendard",
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "#FFFFFF",
                  background: "#AFC5F8",
                  boxShadow: "0px 6px 0px #8FADE8",
                }}
              >
                취소
              </button>

              {/* 계속 진행 */}
              <button
                onClick={handleProceed}
                disabled={isSubmitting}
                className="transition-all duration-150 w-full sm:w-[200px]"
                style={{
                  height: "70px",
                  borderRadius: "15px",
                  fontFamily: "Pretendard",
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "#FFFFFF",
                  background: "#2E4C8F",
                  boxShadow: "0px 6px 0px #1C356B",
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
