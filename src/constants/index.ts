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
  TRIAL_ARCHIVE: "/trial-archive",
  ONGOING_TRIALS: "/ongoing-trials",
  USER_ONGOING_TRIALS: "/user-ongoing-trials",
} as const;

// Route의 path 속성에 사용하는 패턴 (플레이스홀더 포함)
export const PATH_PATTERNS = {
  // 재판 관련 (caseId를 optional로 설정하여 새 재판 시작도 지원)
  firstTrial: `${PATHS.FIRST_TRIAL}/:caseId?`,
  secondTrialRegister: `${PATHS.SECOND_TRIAL_REGISTER}/:caseId`,
  secondTrialRoundOne: `${PATHS.SECOND_TRIAL_ROUND_ONE}/:caseId`,
  secondTrialFinal: `${PATHS.SECOND_TRIAL_FINAL}/:caseId`,
  thirdTrial: `${PATHS.THIRD_TRIAL}/:caseId?`,

  // 기타
  debateDetail: `${PATHS.DEBATE}/:id`,
  vsModeJoin: `${PATHS.VS_MODE_JOIN}/:caseId`,
} as const;

// navigate()할 때 사용하는 빌더 (실제 값 주입)
export const PATH_BUILDERS = {
  // 재판 관련
  firstTrial: (caseId: string | number) => `${PATHS.FIRST_TRIAL}/${caseId}`,
  secondTrialRegister: (caseId: string | number) => `${PATHS.SECOND_TRIAL_REGISTER}/${caseId}`,
  secondTrialRoundOne: (caseId: string | number) => `${PATHS.SECOND_TRIAL_ROUND_ONE}/${caseId}`,
  secondTrialFinal: (caseId: string | number) => `${PATHS.SECOND_TRIAL_FINAL}/${caseId}`,
  thirdTrial: (caseId: string | number) => `${PATHS.THIRD_TRIAL}/${caseId}`,

  // 기타
  debateDetail: (id: string | number) => `${PATHS.DEBATE}/${id}`,
  vsModeJoin: (caseId: string | number) => `${PATHS.VS_MODE_JOIN}/${caseId}`,
} as const;

// 네브바를 숨길 스텝 매핑 (경로별)
export const HIDE_NAV_STEPS_BY_PATH: Record<string, Set<string>> = {
  [PATHS.THIRD_TRIAL]: new Set(["loading", "verdict"]),
};
