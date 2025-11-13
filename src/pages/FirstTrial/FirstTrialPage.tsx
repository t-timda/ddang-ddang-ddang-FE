import { useFirstTrialStore } from "@/stores/firstTrialStore";
import Start from "@/components/first-trial/Start";
import Submit from "@/components/first-trial/Submit";
import Loading from "@/components/first-trial/Loading";
import Result from "@/components/first-trial/Result";
import Judge from "@/components/first-trial/Judge";

export default function FirstTrialPage() {
  const step = useFirstTrialStore((s) => s.step);

  if (step === "start") return <Start />;
  if (step === "submit") return <Submit />;
  if (step === "loading") return <Loading />;
  if (step === "result") return <Result />;
  return <Judge />;
}
