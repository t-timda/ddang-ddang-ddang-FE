import { useMemo, useState, useCallback } from "react";
import Button from "@/components/common/Button";
import { useThirdTrialStore } from "@/stores/thirdTrialStore";
import { THIRD_TRIAL_ARGUMENTS } from "@/mock/thirdTrialArguments";
import {
  THIRD_TRIAL_STEP_META,
  THIRD_TRIAL_STEPS,
} from "@/constants/thirdTrialStepMeta";
import ChevronUpIcon from "@/assets/icons/ChevronUpIcon";

export default function SelectionReview() {
  const selectedArguments = useThirdTrialStore(
    (state) => state.selectedArguments
  );
  const setStep = useThirdTrialStore((state) => state.setStep);

  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});
  const toggleOpen = useCallback((id: number) => {
    setOpenMap((prev) => ({ ...prev, [id]: !(prev[id] ?? true) }));
  }, []);

  const sections = useMemo(
    () =>
      THIRD_TRIAL_STEPS.map((step) => {
        const ids = selectedArguments[step];
        const argumentsForStep = THIRD_TRIAL_ARGUMENTS[step];
        const items = ids
          .map((id) => argumentsForStep.find((argument) => argument.id === id))
          .filter(
            (
              argument
            ): argument is (typeof argumentsForStep)[number] => Boolean(argument)
          );

        return {
          step,
          items,
        };
      }),
    [selectedArguments]
  );

  const handleRetry = () => setStep("adopt");
  const handleProceed = () => setStep("loading");

  return (
    <section className="mx-auto flex w-full max-w-[1280px] flex-col gap-[144px] px-6 py-12 text-main">
      <h1 className="text-center text-[38px] font-bold">최종심 변론 채택</h1>

      {sections.map(({ step, items }) => {
        const meta = THIRD_TRIAL_STEP_META[step];

        return (
          <div key={step} className="flex flex-col items-center gap-8">
            <div
              className={`flex h-[96px] w-full max-w-[995px] items-center justify-center rounded-[30px] ${meta.bgClass}`}
            >
              <span
                className={`text-[24px] font-bold ${meta.headerTextClass}`}
              >
                {meta.label}
              </span>
            </div>

            <div className="flex w-full max-w-[1129px] flex-col gap-4">
              {items.length === 0 ? (
                <div
                  className={`flex h-[146px] items-center justify-center rounded-[30px] bg-white text-lg text-main opacity-70`}
                >
                  선택된 변론이 없습니다.
                </div>
              ) : (
                items.map((argument) => {
                  const isOpen = (openMap[argument.id] ?? true);
                  return (
                  <article
                    key={argument.id}
                    className={`relative flex w-full flex-col gap-6 rounded-[30px] px-8 py-8 md:px-12 ${meta.cardBgClass}`}
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => toggleOpen(argument.id)}
                      className="absolute right-6 top-3 md:right-12 p-1"
                    >
                      <ChevronUpIcon className={`h-[53px] w-[53px] text-main transition-transform duration-200 ${isOpen ? "rotate-0" : "rotate-180"}`} />
                    </button>

                    <div className="flex items-center gap-[25px]">
                      <span className="text-[16px] font-bold text-main">
                        {argument.userNickname}
                      </span>
                      <span
                        className={`rounded-full px-5 py-[5px] text-[14px] font-normal leading-[17px] text-white ${meta.badgeClass}`}
                      >
                        {argument.userDgree}
                      </span>
                    </div>

                    {isOpen && (
                      <p className="text-[16px] font-normal leading-[24px] text-main">
                        {argument.content}
                      </p>
                    )}
                  </article>
                )
                })
              )}
            </div>
          </div>
        );
      })}

      <div className="flex flex-col items-center gap-8">
        <p className="text-center text-[20px] leading-[30px]">
          위의 변론을 채택하시겠습니까? 채택하면 변경이 불가능하며 바로
          최종재판이 진행됩니다
        </p>
        <div className="flex flex-wrap items-center justify-center gap-14">
          <Button
            className="rounded-[15px] bg-[#CCCBCB] px-[50px] py-[30px] text-[24px] font-bold text-white hover:bg-[#BDBDBD]"
            onClick={handleRetry}
          >
            변론 다시 채택하기
          </Button>
          <Button
            className="rounded-[15px] bg-main px-[50px] py-[30px] text-[24px] font-bold text-white hover:opacity-90"
            onClick={handleProceed}
          >
            최종 재판 진행하기
          </Button>
        </div>
      </div>
    </section>
  );
}
