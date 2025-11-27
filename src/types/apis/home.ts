// 로그인 사용자 - 내가 쓴 변론 목록
export type MyDefenseItem = {
  caseId: number;
  defenseId: number;
  debateSide: "A" | "B";
  title?: string;
  content: string;
  likeCount: number;
  caseResult: "WIN" | "LOSE" | "ONGOING" | "PENDING";
  isBlind: boolean;
};

// 로그인 사용자 - 내가 쓴 반론 목록
export type MyRebuttalItem = {
  caseId: number;
  defenseId: number;
  rebuttalId: number;
  debateSide: "A" | "B";
  content: string;
  likeCount: number;
  caseResult: "WIN" | "LOSE" | "ONGOING" | "PENDING";
  isBlind: boolean;
};

export type GetMyDefensesResponse = {
  isSuccess: true;
  code: string;
  message: string;
  result: {
    defenses: MyDefenseItem[];
    rebuttals: MyRebuttalItem[];
  };
  error: null | Record<string, unknown>;
};

// 로그인 사용자 - 내가 참여 중인 재판 목록
export type OngoingCaseItem = {
  caseId: number;
  title: string;
  status: "FIRST" | "SECOND" | "THIRD" | "DONE";
  caseResult: "WIN" | "LOSE" | "ONGOING" | "PENDING";
  mainArguments: string[]; // 스웨거 예시 기준
};

export type GetMyOngoingCasesResponse = {
  isSuccess: true;
  code: string;
  message: string;
  result: OngoingCaseItem[];
  error: null | Record<string, unknown>;
};

// 공개 홈 - 핫 리스트(로그인 불필요)
export type HotCaseItem = {
  caseId: number;
  title: string;
  mainArguments: string[];
  participateCnt?: number;
  isAd?: boolean;
  adLink?: string;
  adImageUrl?: string;
};

export type GetHotCasesResponse = {
  isSuccess: true;
  code: string;
  message: string;
  result: HotCaseItem[];
  error: null | Record<string, unknown>;
};
