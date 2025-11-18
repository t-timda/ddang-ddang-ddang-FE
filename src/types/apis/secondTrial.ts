export interface Defense {
  defenseId: number;
  authorNickname: string;
  side: string;
  content: string;
  likesCount: number;
  isLikedByMe: boolean;
}

export interface UserVote {
  choice: string;
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
  side: string; // "A" | "B"
  content: string;
  likesCount: number;
  isLikedByMe: boolean;
}

export interface SecondTrialDetailsResponse {
  caseTitle: string;
  deadline: string; // ISO datetime string
  defenses: DefenseItem[];
  userVote: UserVote | null;
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
  parentId: number | null;
  authorNickname: string;
  type: string; // "A" | "B"
  content: string;
  likesCount: number;
  isLikedByMe: boolean;
  children?: RebuttalItem[]; // 중첩 반론(대댓글)
}