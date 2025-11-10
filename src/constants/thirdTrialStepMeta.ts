import type { ThirdTrialSide } from "@/types/thirdTrial";

export type ThirdTrialActionVariant = "primary" | "third";

export type ThirdTrialStepMeta = {
  label: string;
  bgClass: string;
  headerTextClass: string;
  summaryBgClass: string;
  summaryBorderClass: string;
  summaryAccentClass: string;
  dividerBorderClass: string;
  cardBgClass: string;
  badgeClass: string;
  checkHighlightClass: string;
};

export const THIRD_TRIAL_STEPS: readonly ThirdTrialSide[] = ["first", "second"];

export const THIRD_TRIAL_STEP_META: Record<
  ThirdTrialSide,
  ThirdTrialStepMeta
> = {
  first: {
    label: "첫 번째 의견",
    bgClass: "bg-main",
    headerTextClass: "text-white",
    summaryBgClass: "bg-main-bright",
    summaryBorderClass: "border-main",
    summaryAccentClass: "text-main",
    dividerBorderClass: "border-main",
    cardBgClass: "bg-main-bright",
    badgeClass: "bg-main-medium",
    checkHighlightClass: "bg-main-bright",
  },
  second: {
    label: "두 번째 의견",
    bgClass: "bg-main-red",
    headerTextClass: "text-white",
    summaryBgClass: "bg-[#FFE5E5]",
    summaryBorderClass: "border-main-red",
    summaryAccentClass: "text-main-red",
    dividerBorderClass: "border-main-red",
    cardBgClass: "bg-[#FFE5E5]",
    badgeClass: "bg-main-red",
    checkHighlightClass: "bg-[#FFE5E5]",
  },
};
