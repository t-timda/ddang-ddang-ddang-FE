import { useEffect } from "react";
import { useThirdTrialStore } from "@/stores/thirdTrialStore";
import { useThirdJudgmentQuery } from "@/hooks/thirdTrial/useThirdTrial";
import VerdictLoadingGif from "@/assets/gifs/판결영상.gif";

export default function Loading() {
  const setStep = useThirdTrialStore((s) => s.setStep);
  const caseId = useThirdTrialStore((s) => s.caseId);

  // 3차 재판 판결 조회 (3초마다 폴링)
  const { data: judgmentData, isSuccess } = useThirdJudgmentQuery(
    caseId ?? undefined,
    3000
  );

  useEffect(() => {
    // 판결 데이터가 성공적으로 로드되면 verdict 화면으로 이동
    if (isSuccess && judgmentData?.result) {
      const timer = setTimeout(() => {
        setStep("verdict");
      }, 3000); // 최소 3초 대기 (GIF 재생)
      return () => clearTimeout(timer);
    }
  }, [isSuccess, judgmentData, setStep]);

  return (
    <div className="w-full h-[calc(100vh-98px)] flex flex-col items-center justify-center">
      <p className="text-gray-600 mt-4">최종 판결을 준비하고 있습니다…</p>
      <img
        src={VerdictLoadingGif}
        alt="판결 로딩 애니메이션"
        className="w-auto max-h-[calc(100vh-98px)] rounded-lg shadow"
      />
    </div>
  );
}
