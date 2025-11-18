export const PATHS = {
  ROOT: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  MY_PAGE: "/mypage",
  FIRST_TRIAL: "/first-trial",
  SECOND_TRIAL: "/second-trial",
  SECOND_TRIAL_REGISTER: "/secondtrial/register",
  SECOND_TRIAL_ROUND_ONE: "/secondtrial/1",
  SECOND_TRIAL_FINAL: "/secondtrial/final",
  THIRD_TRIAL: "/third-trial",
  DEBATE: "/debate",
  VS_MODE_WAITING: "/vs-mode/waiting",
  VS_MODE_JOIN: "/vs-mode/join",
} as const;

export const PATH_BUILDERS = {
  debateDetail: (id: string | number) => `${PATHS.DEBATE}/${id}`,
  secondTrialRegister: (caseId: string | number) => `/secondtrial/register/${caseId}`,
  secondTrialRoundOne: (caseId: string | number) => `/secondtrial/1/${caseId}`,
  secondTrialFinal: (caseId: string | number) => `/secondtrial/final/${caseId}`,
  vsModeJoin: (caseId: string | number) => `/vs-mode/join/${caseId}`,
} as const;

// 네브바를 숨길 스텝 매핑 (경로별)
export const HIDE_NAV_STEPS_BY_PATH: Record<string, Set<string>> = {
  [PATHS.THIRD_TRIAL]: new Set(["loading", "verdict"]),
};
