import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useThirdTrialStore } from "@/stores/thirdTrialStore";
import { useJudgeStatusQuery } from "@/hooks/thirdTrial/useThirdTrial";
import { useSecondTrialDetailsQuery } from "@/hooks/secondTrial/useSecondTrial";
import { useAuthStore } from "@/stores/useAuthStore";
import { PATHS } from "@/constants";
import Adopt from "@/components/third-trial/Adopt";
import SelectionReview from "@/components/third-trial/SelectionReview";
import Loading from "@/components/third-trial/Loading";
import Verdict from "@/components/third-trial/Verdict";

export default function ThirdTrialPage() {
  const { caseId: caseIdParam } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const { step, setCaseId, setStep, caseId: storedCaseId } = useThirdTrialStore();
  const userId = useAuthStore((state) => state.userId);

  const caseId = caseIdParam ? Number(caseIdParam) : null;

  // 판결 상태 조회
  const { data: judgeStatusRes, isLoading: isJudgeStatusLoading } = useJudgeStatusQuery(caseId ?? undefined);
  const judgeStatus = judgeStatusRes?.result;

  // 2차 재판 정보 조회 (작성자 확인용)
  const { data: detailsRes, isLoading: isDetailsLoading } = useSecondTrialDetailsQuery(caseId ?? undefined);
  const details = detailsRes?.result;

  // URL 파라미터에서 caseId를 가져와 store에 설정
  useEffect(() => {
    if (caseId && !isNaN(caseId) && caseId !== storedCaseId) {
      setCaseId(caseId);
    }
  }, [caseId, setCaseId, storedCaseId]);

  // judgeStatus에 따라 적절한 step 설정
  useEffect(() => {
    if (isJudgeStatusLoading || isDetailsLoading) return;

    if (judgeStatus === "AFTER") {
      // 판결이 완료된 경우 - 판결 화면으로
      if (step !== "verdict") {
        setStep("verdict");
      }
    } else if (judgeStatus === "BEFORE") {
      // 판결 전 - 작성자 확인
      if (!details || userId === null) return;

      const isAuthorA = userId === details.argumentA.authorId;
      const isAuthorB = userId === details.argumentB.authorId;
      const isEitherAuthor = isAuthorA || isAuthorB;

      if (!isEitherAuthor) {
        // 작성자가 아니면 메인으로 리다이렉트 (또는 에러 페이지)
        navigate(PATHS.ROOT);
      }
      // 작성자인 경우 step은 기본값 "adopt"를 유지
    }
  }, [judgeStatus, details, userId, isJudgeStatusLoading, isDetailsLoading, step, setStep, navigate]);

  // 로딩 중
  if (isJudgeStatusLoading || isDetailsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-main font-bold">로딩 중...</p>
      </div>
    );
  }

  if (step === "adopt") return <Adopt />;
  if (step === "review") return <SelectionReview />;
  if (step === "loading") return <Loading />;
  if (step === "verdict") return <Verdict />;

  return null;
}
