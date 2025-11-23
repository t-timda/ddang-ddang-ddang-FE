import type { ApiResponse } from "@/types/common/api";

// Adopt 관련 Enum
export type ItemType = "DEFENSE" | "REBUTTAL";
export type DebateSide = "A" | "B" | "DRAW";

// 채택 가능한 항목 (변론/반론)
export interface AdoptableItemDto {
  itemType: ItemType;
  id: number;
  caseId: number;
  userId: number;
  debateSide: DebateSide;
  content: string;
  likeCount: number;
  defenseId?: number; // DEFENSE일 때만 존재 (optional)
  parentId?: number | null; // REBUTTAL일 때만 존재
  parentContent?: string | null; // REBUTTAL일 때만 존재
}

// 채택 후보/결과 응답
export interface AdoptResponseDto {
  items: AdoptableItemDto[];
}

// 수동 채택 요청
export interface AdoptRequestDto {
  defenseId?: number[];
  rebuttalId?: number[];
}

// 채택된 변론 (판결 상세에서 사용)
export interface DefenseAdoptDto {
  caseId: number;
  userId: number;
  defenseId: number;
  debateSide: DebateSide;
  content: string;
  likeCount: number;
}

// 채택된 반론 (판결 상세에서 사용)
export interface RebuttalAdoptDto {
  caseId: number;
  userId: number;
  defenseId: number;
  rebuttalId: number;
  parentId: number;
  parentContent: string;
  debateSide: DebateSide;
  content: string;
  likeCount: number;
}

// API 응답 타입들
export type AdoptCandidatesResponse = ApiResponse<AdoptResponseDto>;
export type AdoptResultResponse = ApiResponse<string>;
export type AdoptStatusResponse = ApiResponse<Record<string, never>>;
export type BestAdoptCandidatesResponse = ApiResponse<AdoptResponseDto>;
