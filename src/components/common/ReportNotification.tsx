// src/components/common/ReportNotification.tsx
import React, { useEffect } from "react";

interface ReportNotificationProps {
  onClose: () => void;
}

const ReportNotification: React.FC<ReportNotificationProps> = ({ onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
      <div className="bg-main-red text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
        <span>신고가 접수되었습니다.</span>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 font-bold"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default ReportNotification;