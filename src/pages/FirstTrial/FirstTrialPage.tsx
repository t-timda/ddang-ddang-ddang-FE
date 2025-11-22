import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFirstTrialStore } from "@/stores/firstTrialStore";
import { useFirstCaseDetailQuery, useFirstJudgmentQuery } from "@/hooks/firstTrial/useFirstTrial";
import Start from "@/components/first-trial/Start";
import Submit from "@/components/first-trial/Submit";
import Loading from "@/components/first-trial/Loading";
import Result from "@/components/first-trial/Result";
import Judge from "@/components/first-trial/Judge";
import VsSubmit from "@/components/first-trial/VsSubmit";

export default function FirstTrialPage() {
  const { caseId: caseIdParam } = useParams<{ caseId: string }>();
  const { step, setCaseId, setStep, caseId: storedCaseId } = useFirstTrialStore();
  const [isInitialized, setIsInitialized] = useState(false);

  const caseId = caseIdParam ? Number(caseIdParam) : undefined;

  // 서버에서 케이스 상세 정보 조회
  const { data: caseDetailRes, isLoading: isCaseLoading } = useFirstCaseDetailQuery(caseId);
  const caseDetail = caseDetailRes?.result;

  // 판결 정보 조회
  const { data: judgmentRes, isLoading: isJudgmentLoading } = useFirstJudgmentQuery(caseId);
  const judgment = judgmentRes?.result;

  // URL 파라미터에서 caseId를 가져와 store에 설정하고, 서버 데이터로 step 복원
  useEffect(() => {
    // 이미 초기화되었으면 리턴
    if (isInitialized) return;

    // caseId가 없으면 새로운 재판 시작
    if (!caseId) {
      setStep("start");
      setIsInitialized(true);
      return;
    }

    // caseId가 있으면 로딩 완료될 때까지 대기
    if (isCaseLoading || isJudgmentLoading) return;

    // store에 caseId 설정
    if (caseId !== storedCaseId) {
      setCaseId(caseId);
    }

    // 판결이 이미 있으면 judge step으로
    if (judgment) {
      setStep("judge");
      setIsInitialized(true);
      return;
    }

    // 케이스 데이터가 있으면 적절한 step으로 복원
    if (caseDetail) {
      // SOLO 모드: argumentB가 있으면 이미 제출 완료 → loading으로
      if (caseDetail.mode === "SOLO" && caseDetail.argumentB) {
        setStep("loading");
      }
      // PARTY 모드: argumentB가 null이면 상대 대기 중 → vsSubmit으로
      else if (caseDetail.mode === "PARTY" && !caseDetail.argumentB) {
        setStep("vsSubmit");
      }
      // PARTY 모드: argumentB가 있으면 양측 모두 제출 완료 → loading으로
      else if (caseDetail.mode === "PARTY" && caseDetail.argumentB) {
        setStep("loading");
      }
      setIsInitialized(true);
    } else {
      // 케이스 데이터가 없으면 새로 시작
      setStep("start");
      setIsInitialized(true);
    }
  }, [caseId, caseDetail, judgment, isCaseLoading, isJudgmentLoading, isInitialized, setCaseId, setStep, storedCaseId]);

  // 로딩 중이면 로딩 표시
  if (!isInitialized || isCaseLoading || isJudgmentLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-main font-bold">로딩 중...</p>
      </div>
    );
  }

  if (step === "start") return <Start />;
  if (step === "submit") return <Submit />;
  if (step === "vsSubmit") return <VsSubmit />;
  if (step === "loading") return <Loading />;
  if (step === "result") return <Result />;
  return <Judge />;
}
