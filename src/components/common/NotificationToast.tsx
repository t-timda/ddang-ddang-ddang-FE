// dev/src/components/common/NotificationToast.tsx
import React, { useEffect } from "react";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { useNavigate } from "react-router-dom";

const NotificationToast: React.FC = () => {
  const navigate = useNavigate();
  const { currentToast, hideToast, setHighlightRebuttal } = useNotificationStore();

  useEffect(() => {
    if (currentToast) {
      const timer = setTimeout(() => {
        hideToast();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [currentToast, hideToast]);

  if (!currentToast) return null;

  console.log('NotificationToast:', currentToast);

  const handleClick = () => {
    if (currentToast.type === "JUDGMENT_COMPLETE" && currentToast.caseId) {
      navigate(`/secondtrial/final/${currentToast.caseId}`);
    } else if (currentToast.rebuttalId) {
      setHighlightRebuttal(currentToast.rebuttalId);
      if (currentToast.caseId) {
        navigate(`/secondtrial/1/${currentToast.caseId}?rebuttalId=${currentToast.rebuttalId}`);
      }
    } else if (currentToast.defenseId && currentToast.caseId) {
      navigate(`/secondtrial/1/${currentToast.caseId}?defenseId=${currentToast.defenseId}`);
    } else if (currentToast.caseId) {
      navigate(`/secondtrial/1/${currentToast.caseId}`);
    } else if (currentToast.judgmentId) {
      navigate(`/secondtrial/final/${currentToast.judgmentId}`);
    }
    hideToast();
  };

  const bgColor = currentToast.type === "JUDGMENT_ERROR" 
    ? "bg-red-500" 
    : currentToast.type === "JUDGMENT_COMPLETE"
    ? "bg-green-500"
    : "bg-blue-600";

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "PARTY_JOINED":
        return "🎉";
      case "DEFENSE_REPLIED":
        return "💬";
      case "REBUTTAL_REPLIED":
        return "↪️";
      case "JUDGMENT_COMPLETE":
        return "⚖️";
      case "JUDGMENT_ERROR":
        return "⚠️";
      default:
        return "🔔";
    }
  };

  return (
    <div
      className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[9999] animate-slide-down pointer-events-none"
    >
      <div
        onClick={handleClick}
        className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity max-w-md pointer-events-auto`}
      >
        {/* 아이콘 */}
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">
            {getNotificationIcon(currentToast.type)}
          </span>
        </div>

        <div className="flex-1">
          {currentToast.authorNickname && (
            <p className="text-xs font-semibold opacity-90 mb-1">
              {currentToast.authorNickname}
            </p>
          )}
          <p className="font-semibold">
            {currentToast.type === "JUDGMENT_COMPLETE"
              ? "재판이 완료되었습니다"
              : currentToast.message}
          </p>
          <p className="text-xs mt-1 opacity-80">클릭하여 확인하기</p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            hideToast();
          }}
          className="text-white hover:text-gray-200 font-bold text-xl flex-shrink-0"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default NotificationToast;