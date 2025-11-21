// src/components/common/RebuttalItem.tsx
import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useNotificationStore } from "@/stores/useNotificationStore";
import type { RebuttalItem as RebuttalItemType, RebuttalRequest } from "@/types/apis/secondTrial";
import { renderContentWithMentions } from "@/utils/mentionRenderer";
import ThumbUpIcon from "@/assets/svgs/thumbs-up.svg?react";
import Siren from "@/assets/svgs/Siren.svg?react";

interface RebuttalItemProps {
  rebuttal: RebuttalItemType;
  depth: number;
  defenseId: number;
  onLike: (rebuttalId: number) => void;
  isLikePending: boolean;
  postRebuttalMutation: any;
  defaultRebuttalType: "A" | "B";
  onReport: (rebuttalId: number) => void;
  currentUserNickname?: string;
  activeReplyInput: number | null;
  setActiveReplyInput: (id: number | null) => void;
}

const RebuttalItem: React.FC<RebuttalItemProps> = ({
  rebuttal,
  depth,
  defenseId,
  onLike,
  isLikePending,
  postRebuttalMutation,
  defaultRebuttalType,
  onReport,
  currentUserNickname,
  activeReplyInput,
  setActiveReplyInput,
}) => {
  const [searchParams] = useSearchParams();
  const { highlightRebuttalId, setHighlightRebuttal } = useNotificationStore();
  const [replyContent, setReplyContent] = useState("");
  const [replyType, setReplyType] = useState<"A" | "B">(defaultRebuttalType);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const replyInputRef = useRef<HTMLTextAreaElement | null>(null);
  const rebuttalRef = useRef<HTMLDivElement>(null);

  const isMyComment = currentUserNickname === rebuttal.authorNickname;
  const typeColorClass = rebuttal.type === "A" ? "text-white" : "text-white";
  const typeBgClass = rebuttal.type === "A" ? "bg-main-medium" : "bg-main-red";
  
  const isThisInputActive = activeReplyInput === rebuttal.rebuttalId;

  // 하이라이트 효과
  useEffect(() => {
    const rebuttalIdFromUrl = searchParams.get("rebuttalId");
    const targetId = rebuttalIdFromUrl ? Number(rebuttalIdFromUrl) : highlightRebuttalId;
    
    if (targetId === rebuttal.rebuttalId && rebuttalRef.current) {
      // 스크롤 이동
      rebuttalRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      // 하이라이트 효과
      setIsHighlighted(true);
      const timer = setTimeout(() => {
        setIsHighlighted(false);
        setHighlightRebuttal(null);
      }, 1500); 
      return () => clearTimeout(timer);
    }
  }, [searchParams, highlightRebuttalId, rebuttal.rebuttalId, setHighlightRebuttal]);

  const handleReplyClick = () => {
    setActiveReplyInput(rebuttal.rebuttalId);
    setReplyContent(`@${rebuttal.authorNickname} `);
  };

  // 입력란이 활성화되면 포커스 및 커서 위치 설정
  useEffect(() => {
    if (isThisInputActive && replyInputRef.current) {
      setTimeout(() => {
        const textarea = replyInputRef.current;
        if (textarea) {
          textarea.focus();
          // 커서를 텍스트 끝으로 이동
          const length = textarea.value.length;
          textarea.setSelectionRange(length, length);
          textarea.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 0);
    }
  }, [isThisInputActive]);

  const handleCancelReply = () => {
    setActiveReplyInput(null);
    setReplyContent("");
  };

  const handleSubmitReply = async () => {
    const trimmed = replyContent.trim();
    if (!trimmed) return;
    
    const body: RebuttalRequest = {
      defenseId,
      parentId: rebuttal.rebuttalId,
      type: replyType,
      content: trimmed,
    };
    
    try {
      await postRebuttalMutation.mutateAsync(body);
      setReplyContent("");
      setActiveReplyInput(null); // 입력란 닫기
    } catch (err) {
      console.error("답글 등록 실패:", err);
      alert("답글 등록에 실패했습니다. 다시 시도해 주세요.");
    }
  };
  
  return (
    <div style={{ paddingLeft: depth > 0 ? `${depth * 24}px` : '0px' }}>
      <div 
        ref={rebuttalRef}
        className={`p-3 rounded-lg transition-all duration-300 ${
          isHighlighted 
            ? 'bg-yellow-100 border-2 border-yellow-400 animate-pulse' 
            : 'bg-main-bright'
        }`}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-main font-semibold">
              <span className="inline-block px-2 py-0.5 rounded-full border border-main text-main text-xs">
                칭호
              </span>
              <span>{rebuttal.authorNickname}</span>
              <span className={`px-2 py-0.5 rounded-xl text-xs font-semibold ${typeColorClass} ${typeBgClass}`}>
                {rebuttal.type} 의견
              </span>
            </div>
            <div className="mt-1 text-main">
              {renderContentWithMentions(rebuttal.content)}
            </div>
            
            <button
              onClick={handleReplyClick}
              className="mt-2 text-xs text-main hover:underline"
            >
              ↳ 답글 달기
            </button>
          </div>

          <div className="flex items-center gap-2 ml-2">
            <button
              onClick={() => onReport(rebuttal.rebuttalId)}
              className="flex items-center gap-1 text-xs px-2 py-1 text-red-500 hover:text-red-700"
            >
              <Siren className="w-4 h-4" />
              <span>신고하기</span>
            </button>
            <button
              onClick={() => onLike(rebuttal.rebuttalId)}
              disabled={isLikePending || isMyComment}
              className="flex items-center gap-2 text-main disabled:opacity-50"
              aria-label="반론 좋아요"
              title={isMyComment ? "내 댓글에는 좋아요를 누를 수 없습니다" : ""}
            >
              <ThumbUpIcon className="w-5 h-5" />
              <span className="text-sm">
                {rebuttal.likesCount}명이 이 의견에 찬성합니다
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 답글 입력창 - 이 댓글의 ID가 activeReplyInput과 일치할 때만 표시 */}
      {isThisInputActive && (
        <div className="mt-2 p-3 rounded-md bg-main-bright">
          <div className="text-xs text-main mb-2 flex justify-between items-center">
            <span>@{rebuttal.authorNickname}에게 답글 작성 중...</span>
            <button
              onClick={handleCancelReply}
              className="underline hover:text-red-500"
            >
              취소
            </button>
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <label className="text-sm text-main">타입</label>
            <select
              value={replyType}
              onChange={(e) => setReplyType(e.target.value as "A" | "B")}
              className="p-1 rounded-md"
            >
              <option value="A">A 의견</option>
              <option value="B">B 의견</option>
            </select>
          </div>

          <textarea
            ref={replyInputRef}
            rows={3}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="w-full p-2 rounded-md bg-white"
            placeholder="답글 내용을 입력하세요."
          />

          <div className="flex justify-end mt-2">
            <button
              onClick={handleSubmitReply}
              disabled={postRebuttalMutation.isPending}
              className="px-4 py-2 bg-main text-white rounded-md disabled:opacity-50"
            >
              {postRebuttalMutation.isPending ? "등록중..." : "답글 등록"}
            </button>
          </div>
        </div>
      )}

      {/* 자식 대댓글들 재귀 렌더링 */}
      {rebuttal.children?.length ? (
        <div className="mt-2 space-y-2">
          {rebuttal.children.map((child) => (
            <RebuttalItem
              key={child.rebuttalId}
              rebuttal={child}
              depth={depth + 1}
              defenseId={defenseId}
              onLike={onLike}
              isLikePending={isLikePending}
              postRebuttalMutation={postRebuttalMutation}
              defaultRebuttalType={defaultRebuttalType}
              onReport={onReport}
              currentUserNickname={currentUserNickname}
              activeReplyInput={activeReplyInput}
              setActiveReplyInput={setActiveReplyInput}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default RebuttalItem;