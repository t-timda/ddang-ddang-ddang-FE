export const PATHS = {
  ROOT: "/",
  LOGIN: "/login",
  MY_PAGE: "/mypage",
  FIRST_TRIAL_START: "/firsttrial/start",
  FIRST_TRIAL_SUBMIT: "/firsttrial/submit",
  FIRST_TRIAL_LOADING: "/first-trial/loading",
  FIRST_TRIAL_RESULT: "/first-trial/result",
  AI_JUDGE: "/ai-judge",
  SECOND_TRIAL: "/second-trial",
  SECOND_TRIAL_REGISTER: "/secondtrial/register",
  SECOND_TRIAL_ROUND_ONE: "/secondtrial/1",
  SECOND_TRIAL_FINAL: "/secondtrial/final",
  THIRD_TRIAL: "/third-trial",
  DEBATE: "/debate",
} as const;

export const PATH_BUILDERS = {
  debateDetail: (id: string | number) => `${PATHS.DEBATE}/${id}`,
} as const;

// 네브바를 숨길 스텝 매핑 (경로별)
// 스텝 값은 문자열로 관리하여 스토어와의 결합을 느슨하게 유지합니다.
export const HIDE_NAV_STEPS_BY_PATH: Record<string, Set<string>> = {
  [PATHS.THIRD_TRIAL]: new Set(["loading", "verdict"]),
};
