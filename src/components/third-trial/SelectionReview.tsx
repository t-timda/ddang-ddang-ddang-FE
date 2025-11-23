import { useMemo, useState, useCallback } from "react";
import Button from "@/components/common/Button";
import { useThirdTrialStore } from "@/stores/thirdTrialStore";
import { useBestAdoptItemsQuery, useAdoptItemsMutation, useChangeToThirdTrialMutation, useCreateJudgmentMutation } from "@/hooks/thirdTrial/useThirdTrial";
import type { AdoptableItemDto } from "@/types/apis/adopt";
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
  const caseId = useThirdTrialStore((state) => state.caseId);

  // 채택 가능한 항목 조회
  const { data: bestItemsRes, isLoading: isLoadingItems } = useBestAdoptItemsQuery(caseId ?? undefined);
  const bestItems = bestItemsRes?.result?.items ?? [];

  // 수동 채택 mutation
  const adoptItemsMutation = useAdoptItemsMutation();

  // 3차 재판으로 상태 변경 mutation
  const changeToThirdTrialMutation = useChangeToThirdTrialMutation();

  // 최종 판결 생성 mutation
  const createJudgmentMutation = useCreateJudgmentMutation();

  const isPending = adoptItemsMutation.isPending || changeToThirdTrialMutation.isPending || createJudgmentMutation.isPending;

  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});
  const toggleOpen = useCallback((id: number) => {
    setOpenMap((prev) => ({ ...prev, [id]: !(prev[id] ?? true) }));
  }, []);

  // 선택된 ID에 해당하는 실제 아이템 찾기
  const sections = useMemo(
    () =>
      THIRD_TRIAL_STEPS.map((step) => {
        const ids = selectedArguments[step];
        const debateSide = step === "first" ? "A" : "B";

        // 해당 debateSide의 아이템들 필터링
        const itemsForSide = bestItems.filter((item) => item.debateSide === debateSide);

        // 선택된 ID에 해당하는 아이템 찾기
        const items = ids
          .map((id) => itemsForSide.find((item) => item.id === id))
          .filter((item): item is AdoptableItemDto => Boolean(item));

        return {
          step,
          items,
        };
      }),
    [selectedArguments, bestItems]
  );

  // 로딩 상태
  if (isLoadingItems) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-main font-bold">선택한 변론을 불러오는 중...</p>
      </div>
    );
  }

  const handleRetry = () => setStep("adopt");
  const handleProceed = async () => {
    if (!caseId) {
      alert("케이스 ID가 없습니다.");
      return;
    }

    // 선택된 ID를 defenseId와 rebuttalId로 분류
    const allSelectedIds = [...selectedArguments.first, ...selectedArguments.second];
    const selectedItems = bestItems.filter((item) => allSelectedIds.includes(item.id));

    const defenseIds = selectedItems
      .filter((item) => item.itemType === "DEFENSE")
      .map((item) => item.id);

    const rebuttalIds = selectedItems
      .filter((item) => item.itemType === "REBUTTAL")
      .map((item) => item.id);

    try {
      // 1. 수동 채택 API 호출
      await adoptItemsMutation.mutateAsync({
        caseId,
        body: {
          defenseId: defenseIds.length > 0 ? defenseIds : undefined,
          rebuttalId: rebuttalIds.length > 0 ? rebuttalIds : undefined,
        },
      });

      // 2. 3차 재판으로 상태 변경
      await changeToThirdTrialMutation.mutateAsync(caseId);

      // 3. 최종 판결 생성 (argumentA와 B 모두 채택된 경우)
      await createJudgmentMutation.mutateAsync(caseId);

      // 4. 로딩 화면으로 이동
      setStep("loading");
    } catch (error) {
      console.error("채택 또는 3차 재판 시작 실패:", error);
      alert("재판 진행에 실패했습니다. 다시 시도해주세요.");
    }
  };

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
                items.map((item) => {
                  const isOpen = (openMap[item.id] ?? true);
                  return (
                  <article
                    key={item.id}
                    className={`relative flex w-full flex-col gap-6 rounded-[30px] px-8 py-8 md:px-12 ${meta.cardBgClass}`}
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => toggleOpen(item.id)}
                      className="absolute right-6 top-3 md:right-12 p-1"
                    >
                      <ChevronUpIcon className={`h-[53px] w-[53px] text-main transition-transform duration-200 ${isOpen ? "rotate-0" : "rotate-180"}`} />
                    </button>

                    <div className="flex items-center gap-[25px]">
                      <span className="text-[16px] font-bold text-main">
                        유저 {item.userId}
                      </span>
                      <span
                        className={`rounded-full px-5 py-[5px] text-[14px] font-normal leading-[17px] text-white ${meta.badgeClass}`}
                      >
                        {item.itemType === "DEFENSE" ? "변론" : "반론"} | ♥ {item.likeCount}
                      </span>
                    </div>

                    {isOpen && (
                      <p className="text-[16px] font-normal leading-[24px] text-main">
                        {item.content}
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
            disabled={isPending}
          >
            {isPending ? "재판 시작 중..." : "최종 재판 진행하기"}
          </Button>
        </div>
      </div>
    </section>
  );
}
