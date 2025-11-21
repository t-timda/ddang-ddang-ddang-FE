// src/components/common/ReportModal.tsx
import React, { useState } from "react";
import type { ReportReason, ReportContentType } from "@/types/apis/report";
import { usePostReportMutation } from "@/hooks/report/useReport";

interface ReportModalProps {
  contentId: number;
  contentType: ReportContentType;
  content?: string; // 신고 대상 콘텐츠 내용 추가
  onClose: () => void;
  onSuccess?: () => void;
}

const REPORT_REASONS: { value: ReportReason; label: string }[] = [
  { value: "PROFANITY", label: "욕설 및 비방" },
  { value: "SPAM", label: "스팸 또는 광고" },
  { value: "HARASSMENT", label: "괴롭힘" },
  { value: "INAPPROPRIATE", label: "부적절한 콘텐츠" },
  { value: "OTHER", label: "기타" },
];

const ReportModal: React.FC<ReportModalProps> = ({
  contentId,
  contentType,
  content, // 추가
  onClose,
  onSuccess,
}) => {
  const [selectedReason, setSelectedReason] = useState<ReportReason>("PROFANITY");
  const [customReason, setCustomReason] = useState("");
  
  const reportMutation = usePostReportMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedReason) {
      alert("신고 사유를 선택해주세요.");
      return;
    }

    try {
      await reportMutation.mutateAsync({
        contentId,
        contentType,
        reason: selectedReason,
        customReason: customReason.trim() || undefined,
        content, // 신고 대상 내용 포함
      });
      
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("신고 제출 실패:", err);
      alert("신고 제출에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      onClick={handleBackgroundClick}
    >
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 border-2 border-main-medium shadow-lg">
        <h2 className="text-xl font-bold text-main mb-4">신고하기</h2>
        
        {/* 신고 대상 내용 미리보기 (선택사항) */}
        {content && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">신고 대상 내용:</p>
            <p className="text-sm text-gray-700 line-clamp-3">{content}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-main mb-2">
              신고 사유
            </label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value as ReportReason)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-main"
            >
              {REPORT_REASONS.map((reason) => (
                <option key={reason.value} value={reason.value}>
                  {reason.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-main mb-2">
              상세 사유 (선택)
            </label>
            <textarea
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-main"
              placeholder="신고 사유를 상세히 입력해주세요."
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              disabled={reportMutation.isPending}
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-main-red text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
              disabled={reportMutation.isPending}
            >
              {reportMutation.isPending ? "제출 중..." : "신고하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;