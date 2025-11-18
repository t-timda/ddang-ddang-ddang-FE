import { useVsModeStore } from "@/stores/vsModeStore";
import WaitingTrialList from "./WaitingTrialList";
import JoinTrialPage from "./JoinTrialPage";
import RivalVsSubmit from "./RivalVsSubmit";
import VsLoading from "./VsLoading";
import VsResult from "./VsResult";
import VsJudge from "./VsJudge";

export default function VsModePage() {
  const step = useVsModeStore((s) => s.step);

  if (step === "waiting") return <WaitingTrialList />;
  if (step === "join") return <JoinTrialPage />;
  if (step === "submit") return <RivalVsSubmit />;
  if (step === "loading") return <VsLoading />;
  if (step === "result") return <VsResult />;
  return <VsJudge />;
}