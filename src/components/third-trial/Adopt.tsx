import { useCallback, useMemo, useState } from "react";
import clsx from "clsx";
import Button from "@/components/common/Button";
import ArgumentCheck from "@/components/third-trial/ArgumentCheck";
import { useThirdTrialStore } from "@/stores/thirdTrialStore";
import { THIRD_TRIAL_ARGUMENTS } from "@/mock/thirdTrialArguments";
import {
  THIRD_TRIAL_STEP_META,
  THIRD_TRIAL_STEPS,
} from "@/constants/thirdTrialStepMeta";

const MAX_SELECTION_PER_STEP = 3;

export default function Adopt() {
  const setStep = useThirdTrialStore((state) => state.setStep);
  const selectedArguments = useThirdTrialStore(
    (state) => state.selectedArguments
  );
  const updateSelectedArguments = useThirdTrialStore(
    (state) => state.updateSelectedArguments
  );
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const currentStepKey =
    THIRD_TRIAL_STEPS[Math.min(currentStepIndex, THIRD_TRIAL_STEPS.length - 1)];
  const meta = THIRD_TRIAL_STEP_META[currentStepKey];

  const argumentsForStep = THIRD_TRIAL_ARGUMENTS[currentStepKey];
  const selectedForStep = selectedArguments[currentStepKey];

  const isMaxReached = useMemo(
    () => selectedForStep.length >= MAX_SELECTION_PER_STEP,
    [selectedForStep]
  );

  const handleToggle = useCallback(
    (argumentId: number, nextChecked: boolean) => {
      if (
        nextChecked &&
        !selectedForStep.includes(argumentId) &&
        isMaxReached
      ) {
        return;
      }

      const nextForSide = nextChecked
        ? Array.from(new Set([...selectedForStep, argumentId]))
        : selectedForStep.filter((id) => id !== argumentId);

      updateSelectedArguments(currentStepKey, nextForSide);
    },
    [currentStepKey, isMaxReached, selectedForStep, updateSelectedArguments]
  );

  const handleNext = () => {
    const isLastStep = currentStepIndex >= THIRD_TRIAL_STEPS.length - 1;
    if (!isLastStep) {
      setCurrentStepIndex((prev) => prev + 1);
      return;
    }
    setStep("review");
  };

  const selectedCountText = `선택된 변론 ${selectedForStep.length}개 / ${MAX_SELECTION_PER_STEP}개`;

  return (
    <section className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-8 px-6 py-10 text-main">
      <header className="flex w-full max-w-6xl flex-col items-center gap-6">
        <h1 className="text-center text-4xl font-bold md:text-4xl">
          최종심 변론 채택
        </h1>
        <div
          className={clsx(
            "flex w-full items-center justify-center rounded-[30px] py-10",
            meta.bgClass
          )}
        >
          <span
            className={clsx("text-[24px] font-bold", meta.headerTextClass)}
          >
            {meta.label}
          </span>
        </div>
        <p className="text-center text-base md:text-lg">
          현재 {meta.label}을 검토 중입니다. 각 단계에서 최대{" "}
          {MAX_SELECTION_PER_STEP}개까지 채택할 수 있어요.
        </p>
      </header>

      <div className="flex w-full max-w-6xl justify-end">
        <Button
          className={clsx("rounded-[15px] px-12 py-7 text-lg font-bold", meta.bgClass)}
          disabled={selectedForStep.length === 0}
          onClick={handleNext}
        >
          {meta.label} 채택 완료
        </Button>
      </div>

      <div
        className={clsx(
          "w-full max-w-6xl rounded-[20px] px-6 py-4 text-base border",
          meta.summaryBgClass,
          meta.summaryBorderClass
        )}
      >
        <span className="font-semibold">{selectedCountText}</span>
        {isMaxReached && (
          <span
            className={clsx("mt-1 block text-sm", meta.summaryAccentClass)}
          >
            최대 {MAX_SELECTION_PER_STEP}개까지 선택할 수 있습니다.
          </span>
        )}
      </div>

      <div
        className={clsx(
          "flex w-full max-w-6xl flex-col items-center border-t",
          meta.dividerBorderClass
        )}
      >
        {argumentsForStep.map((argument) => {
          const isSelected = selectedForStep.includes(argument.id);
          const disabled = !isSelected && isMaxReached;
          return (
            <ArgumentCheck
              key={argument.id}
              argument={argument}
              checked={isSelected}
              disabled={disabled}
              onToggle={handleToggle}
              checkClassName={meta.checkHighlightClass}
            />
          );
        })}
      </div>
    </section>
  );
}
