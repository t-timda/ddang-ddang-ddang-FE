import { useThirdTrialStore } from "@/stores/thirdTrialStore";
import Adopt from "@/components/third-trial/Adopt";
import SelectionReview from "@/components/third-trial/SelectionReview";
import Loading from "@/components/third-trial/Loading";
import Verdict from "@/components/third-trial/Verdict";

export default function ThirdTrialPage() {
  const step = useThirdTrialStore((s) => s.step);

  if (step === "adopt") return <Adopt />;
  if (step === "review") return <SelectionReview />;
  if (step === "loading") return <Loading />;
  if (step === "verdict") return <Verdict />;
  
  return null;
}
