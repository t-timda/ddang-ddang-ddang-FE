import React, { useMemo, useRef, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useRebuttalsQuery,
  usePostRebuttalMutation,
} from "@/hooks/secondTrial/useSecondTrial";
import {
  useToggleRebuttalLikeMutation,
  useToggleDefenseLikeMutation,
} from "@/hooks/like/useLike";
import { useUserProfileQuery } from "@/hooks/api/useUserQuery";
import { useNotificationStore } from "@/stores/useNotificationStore";
import type {
  RebuttalItem as RebuttalItemType,
  RebuttalRequest,
  LikeRequest,
} from "@/types/apis/secondTrial";
import RebuttalItem from "./RebuttalItem";
import ReportNotification from "./ReportNotification";
import ReportModal from "./ReportModal";
import ThumbUpIcon from "@/assets/svgs/thumbs-up.svg?react";
import Siren from "@/assets/svgs/siren.svg?react";

export interface ArgumentData {
  id: number;
  userNickname: string;
  userDgree: string;
  content: string;
  likes: number;
  isBest: boolean;
  isReplyable: boolean;
}

export interface ArgumentCardProps {
  defenseId: number;
  caseId: number;
  authorNickname?: string;
  side?: string;
  content?: string;
  likesCount?: number;
  isLikedByMe?: boolean;
  badgeLabel?: string;
}

const ArgumentCard: React.FC<ArgumentCardProps> = ({
  defenseId,
  caseId,
  authorNickname = "닉네임",
  side,
  content,
  likesCount = 0,
  isLikedByMe,
  badgeLabel = "칭호",
}) => {
  const [searchParams] = useSearchParams();
  const { setHighlightRebuttal } = useNotificationStore();
  
  // Queries & Mutations
  const { data: rebuttalsRes, isLoading: isRebuttalsLoading } = useRebuttalsQuery(defenseId);
  const postRebuttalMutation = usePostRebuttalMutation();
  const toggleRebuttalLikeMutation = useToggleRebuttalLikeMutation();
  const toggleDefenseLikeMutation = useToggleDefenseLikeMutation();
  const { data: userProfile } = useUserProfileQuery({ enabled: true });

  // States
  const [expanded, setExpanded] = useState(false);
  const [rebuttalContent, setRebuttalContent] = useState("");
  const [rebuttalType, setRebuttalType] = useState<"A" | "B">((side as "A" | "B") || "A");
  const [likedDefense, setLikedDefense] = useState(!!isLikedByMe);
  const [defenseLikes, setDefenseLikes] = useState(likesCount);
  const [showReportNotification, setShowReportNotification] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportTarget, setReportTarget] = useState<{ 
    contentId: number; 
    contentType: "DEFENSE" | "REBUTTAL";
    content?: string;
  } | null>(null);
  
  const [activeReplyInput, setActiveReplyInput] = useState<number | null>(null);
  
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const currentUserNickname = userProfile?.nickname;
  const isMyDefense = currentUserNickname === authorNickname;

  // 스타일 클래스
  const sideColorClass = side === "A" ? "text-white" : "text-white";
  const sideBgClass = side === "A" ? "bg-main-medium" : "bg-main-red";

  // 반론 데이터 처리
  const rawRebuttals: RebuttalItemType[] = (rebuttalsRes?.result as RebuttalItemType[]) ?? [];
  
  const rebuttals = useMemo(() => {
    if (!rawRebuttals || rawRebuttals.length === 0) return [];
    return [...rawRebuttals].sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));
  }, [JSON.stringify(rawRebuttals.map(r => ({ id: r.rebuttalId, likes: r.likesCount })))]);

  const repliesCount = useMemo(() => {
    const countReplies = (items: RebuttalItemType[]): number => {
      return items.reduce((acc, item) => {
        return acc + 1 + (item.children ? countReplies(item.children) : 0);
      }, 0);
    };
    return countReplies(rawRebuttals);
  }, [rawRebuttals]);

  // URL에서 rebuttalId가 있으면 자동으로 펼치기
  useEffect(() => {
    const rebuttalId = searchParams.get("rebuttalId");
    if (rebuttalId) {
      setExpanded(true);
      setHighlightRebuttal(Number(rebuttalId));
      
      // 3초 후 하이라이트 제거
      const timer = setTimeout(() => {
        setHighlightRebuttal(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [searchParams, setHighlightRebuttal]);

  // 핸들러들
  const handleToggleExpanded = () => setExpanded((v) => !v);

  const handleFocusWrite = () => {
    if (!expanded) setExpanded(true);
    setRebuttalContent("");
    setActiveReplyInput(null);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 0);
  };

  const handleSubmitRebuttal = async () => {
    const trimmed = rebuttalContent.trim();
    if (!trimmed) return;
    
    const body: RebuttalRequest = {
      defenseId,
      parentId: null,
      type: rebuttalType,
      content: trimmed,
    };
    
    try {
      await postRebuttalMutation.mutateAsync(body);
      setRebuttalContent("");
      if (!expanded) setExpanded(true);
    } catch (err) {
      console.error("반론 등록 실패:", err);
      alert("의견 등록에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  const handleToggleDefenseLike = () => {
    if (toggleDefenseLikeMutation.isPending || isMyDefense) return;
    
    const body: LikeRequest = { contentId: defenseId, contentType: "DEFENSE" };
    const nextLiked = !likedDefense;
    
    setLikedDefense(nextLiked);
    setDefenseLikes((c) => Math.max(0, c + (nextLiked ? 1 : -1)));
    
    toggleDefenseLikeMutation.mutate(
      { caseId, body },
      {
        onSuccess: (res) => {
          if (res.result !== nextLiked) {
            setLikedDefense(res.result);
            setDefenseLikes((c) =>
              Math.max(0, c + (res.result ? 1 : -1) - (nextLiked ? 1 : -1))
            );
          }
        },
        onError: () => {
          setLikedDefense((prev) => !prev);
          setDefenseLikes((c) => Math.max(0, c + (nextLiked ? -1 : 1)));
          alert("방어변론 좋아요 처리 실패");
        },
      }
    );
  };

  const handleLikeRebuttal = async (rebuttalId: number) => {
    if (toggleRebuttalLikeMutation.isPending) return;
    const body: LikeRequest = { contentId: rebuttalId, contentType: "REBUTTAL" };
    toggleRebuttalLikeMutation.mutate(
      { defenseId, body },
      {
        onError: () => alert("반론 좋아요 처리 실패"),
      }
    );
  };

  const handleReport = (contentId: number, contentType: "DEFENSE" | "REBUTTAL", reportContent?: string) => {
    setReportTarget({ contentId, contentType, content: reportContent });
    setShowReportModal(true);
  };

  const handleReportSuccess = () => {
    setShowReportNotification(true);
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg">
        {/* 헤더 */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <span className="text-main font-semibold">{badgeLabel}</span>
            <span className="inline-block px-3 py-1 rounded-full text-main">{authorNickname}</span>
            <span className={`inline-block px-3 py-1 rounded-xl text-sm font-semibold ${sideColorClass} ${sideBgClass}`}>
              {side} 의견
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleReport(defenseId, "DEFENSE", content)}
              className="flex items-center gap-1 text-xs px-2 py-1 text-red-500 hover:text-red-700"
            >
              <Siren className="w-4 h-4" />
              <span>신고하기</span>
            </button>
            <button
              onClick={handleToggleDefenseLike}
              disabled={toggleDefenseLikeMutation.isPending || isMyDefense}
              className="flex items-center gap-2 text-main disabled:opacity-50"
              aria-label="방어변론 좋아요"
              title={isMyDefense ? "내 방어변론에는 좋아요를 누를 수 없습니다" : ""}
            >
              <ThumbUpIcon className={likedDefense ? "opacity-60" : ""} />
              <span className="text-md">{defenseLikes}명이 이 의견에 찬성합니다</span>
            </button>
          </div>
        </div>

        {/* 본문 */}
        {side && <div className="mt-3"/>}
        <p className="mt-2 leading-7 text-main">{content}</p>

        {/* 토글/의견달기 */}
        <div className="mt-4 flex flex-col gap-3">
          <button
            className="flex items-center gap-2 text-main font-semibold"
            onClick={handleToggleExpanded}
          >
            <span className="text-lg">{expanded ? "▲" : "▶"}</span>
            <span>{expanded ? "의견 접기" : `의견 ${repliesCount}개 펼쳐보기`}</span>
          </button>

          <button
            className="flex items-center gap-2 text-main"
            onClick={handleFocusWrite}
          >
            <span className="text-lg">↳</span>
            <span className="font-semibold">의견달기</span>
          </button>
        </div>

        {/* 펼친 영역 */}
        {expanded && (
          <div className="mt-4 bg-main-bright">
            {isRebuttalsLoading ? (
              <div className="text-sm text-gray-500">의견을 불러오는 중...</div>
            ) : rebuttals.length === 0 ? (
              <div className="text-sm text-gray-500">등록된 의견이 없습니다.</div>
            ) : (
              rebuttals.map((r) => (
                <RebuttalItem
                  key={r.rebuttalId}
                  rebuttal={r}
                  depth={0}
                  defenseId={defenseId}
                  onLike={handleLikeRebuttal}
                  isLikePending={toggleRebuttalLikeMutation.isPending}
                  postRebuttalMutation={postRebuttalMutation}
                  defaultRebuttalType={rebuttalType}
                  onReport={(rebuttalId) => handleReport(rebuttalId, "REBUTTAL")} 
                  currentUserNickname={currentUserNickname}
                  activeReplyInput={activeReplyInput}
                  setActiveReplyInput={setActiveReplyInput}
                />
              ))
            )}

            {/* 최상위 의견 입력 */}
            {activeReplyInput === null && (
              <div className="mt-2 p-3 rounded-md bg-main-bright">
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm text-main">타입</label>
                  <select
                    value={rebuttalType}
                    onChange={(e) => setRebuttalType(e.target.value as "A" | "B")}
                    className="p-1 rounded-md"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                  </select>
                </div>

                <textarea
                  ref={inputRef}
                  rows={3}
                  value={rebuttalContent}
                  onChange={(e) => setRebuttalContent(e.target.value)}
                  className="w-full p-2 rounded-md bg-white border"
                  placeholder="의견 내용을 입력하세요."
                />

                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleSubmitRebuttal}
                    disabled={postRebuttalMutation.isPending}
                    className="px-4 py-2 bg-main text-white rounded-md"
                  >
                    {postRebuttalMutation.isPending ? "등록중..." : "의견 등록"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showReportModal && reportTarget && (
        <ReportModal
          contentId={reportTarget.contentId}
          contentType={reportTarget.contentType}
          content={reportTarget.content}
          onClose={() => {
            setShowReportModal(false);
            setReportTarget(null);
          }}
          onSuccess={handleReportSuccess}
        />
      )}

      {showReportNotification && (
        <ReportNotification onClose={() => setShowReportNotification(false)} />
      )}
    </>
  );
};

export default ArgumentCard;