import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotificationStore } from "@/stores/useNotificationStore";
import type { NotificationData } from "@/types/apis/notification";
import GrayBell from "@/assets/svgs/grayBell.svg?react";

interface NotificationDropdownProps {
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { notifications, clearNotifications, setHighlightRebuttal, markAsRead, removeNotification } = useNotificationStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [onClose]);

  const handleNotificationClick = (e: React.MouseEvent, notification: NotificationData) => {
    e.preventDefault();
    e.stopPropagation();
    
    // 읽음 처리
    markAsRead(notification.timestamp);
    
    if (notification.rebuttalId) {
      setHighlightRebuttal(notification.rebuttalId);
      if (notification.caseId) {
        navigate(`/secondtrial/1/${notification.caseId}?rebuttalId=${notification.rebuttalId}`);
      }
    } else if (notification.defenseId && notification.caseId) {
      navigate(`/secondtrial/1/${notification.caseId}?defenseId=${notification.defenseId}`);
    } else if (notification.caseId) {
      navigate(`/secondtrial/1/${notification.caseId}`);
    } else if (notification.judgmentId) {
      navigate(`/secondtrial/final/${notification.judgmentId}`);
    }
    
    onClose();
  };

  const handleRemoveNotification = (e: React.MouseEvent, timestamp: number) => {
    e.stopPropagation();
    removeNotification(timestamp);
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "방금 전";
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    return `${days}일 전`;
  };

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
      ref={dropdownRef}
      className="absolute top-full right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-[9999] max-h-[500px] overflow-hidden flex flex-col p-4"
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-lg text-main">알림</h3>
        {notifications.length > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              clearNotifications();
            }}
            className="text-xs text-main hover:text-main-medium font-semibold"
          >
            모두 삭제
          </button>
        )}
      </div>

      {/* 알림 목록 */}
      <div className="overflow-y-auto flex-1 -mx-2">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <GrayBell className="w-16 h-16 mx-auto mb-2" />
            <p>알림이 없습니다</p>
          </div>
        ) : (
          <div className="space-y-2 px-2">
            {notifications.map((notification: NotificationData) => (
              <div
                key={notification.timestamp}
                className="relative"
              >
                <button
                  onClick={(e) => handleNotificationClick(e, notification)}
                  className={`w-full p-3 text-left hover:bg-main-bright transition-colors cursor-pointer rounded-lg ${
                    notification.isRead ? 'opacity-60' : ''
                  }`}
                  type="button"
                >
                  <div className="flex items-start gap-3 pr-6">
                    {/* 아이콘 */}
                    <div className="w-10 h-10 rounded-full bg-main-bright flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">
                        {getNotificationIcon(notification.type)}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      {notification.authorNickname && (
                        <p className="text-xs font-semibold text-gray-700 mb-1">
                          {notification.authorNickname}
                        </p>
                      )}
                      <p className="text-sm text-gray-900 font-medium line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatTime(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                </button>
                
                {/* X 버튼 */}
                <button
                  onClick={(e) => handleRemoveNotification(e, notification.timestamp)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-1"
                  type="button"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;