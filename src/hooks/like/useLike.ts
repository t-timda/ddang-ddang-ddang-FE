import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleLike } from "@/apis/like/likeApi";
import type { LikeRequest } from "@/types/apis/secondTrial";

// 좋아요 제출 훅 (방어변론) → 토글 구현
// variables: { caseId, body: { contentId, contentType: "DEFENSE" } }
export const useToggleDefenseLikeMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ caseId, body }: { caseId: number; body: LikeRequest }) => toggleLike(body),
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ["defenses", v.caseId] });
      qc.invalidateQueries({ queryKey: ["secondTrialDetails", v.caseId] });
    }
  });
};

// 반론 좋아요 토글
// variables: { defenseId, body: { contentId: rebuttalId, contentType: "REBUTTAL" } }
export const useToggleRebuttalLikeMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ defenseId, body }: { defenseId: number; body: LikeRequest }) => toggleLike(body),
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ["rebuttals", v.defenseId] });
    }
  });
};