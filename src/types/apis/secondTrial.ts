export interface Defense {
  defenseId: number;
  authorNickname: string;
  authorRank?: string; // 추가
  side: string;
  content: string;
  likesCount: number;
  isLikedByMe: boolean;
}

export interface UserVote {
  choice: string;
}

export interface StartSecondTrialRequest {
  hoursToAdd: number;
}

export interface DefenseRequest {
  side: "A" | "B" | string;
  content: string;
}

export interface DefenseResponse {
  defenseId: number;
}

export interface DefenseItem {
  defenseId: number;
  authorNickname: string;
  authorRank?: string; // 추가
  side: string;
  content: string;
  likesCount: number;
  isLikedByMe: boolean;
  rebuttals?: RebuttalItem[];
}

export interface SecondTrialDetailsResponse {
  caseId: number;
  caseTitle: string;
  deadline: number[]; // LocalDateTime array [year, month, day, hour, minute, second, nanoseconds]
  defenses: DefenseItem[];
  userVote: UserVote | null;
  currentJudgment: {
    judgeIllustrationUrl: string;
    verdict: string;
    conclusion: string;
    ratioA: number;
    ratioB: number;
  } | null;
  argumentA: {
    mainArgument: string;
    reasoning: string;
    authorId: number;
  };
  argumentB: {
    mainArgument: string;
    reasoning: string;
    authorId: number;
  };
  isAd?: boolean;
  adLink?: string;
  adImageUrl?: string;
}

/* 좋아요 */
export interface LikeRequest {
  contentId: number;
  contentType: "DEFENSE" | "REBUTTAL" | string;
}

/* 투표 */
export interface VoteRequest {
  choice: "A" | "B" | string;
}

export interface VoteResultResponse {
  ratioA: number;
  ratioB: number;
  totalVotes: number;
}

export interface RebuttalRequest {
  defenseId: number;
  type: string; // "A" | "B"
  content: string;
  parentId: number | null;
}

// result는 이제 number (rebuttalId)
// 기존 RebuttalResponse는 제거하고 ApiResponse<number>로 직접 사용

export interface RebuttalItem {
  rebuttalId: number;
  defenseId: number;
  parentId: number | null;
  authorNickname: string;
  authorRank?: string; // authorDegree → authorRank로 변경
  type: "A" | "B";
  content: string;
  likesCount?: number;
  isLikedByMe?: boolean;
  children?: RebuttalItem[];
}