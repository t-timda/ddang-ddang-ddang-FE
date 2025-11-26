import React from "react";
import Button from "@/components/common/Button";
import { FaBook } from "react-icons/fa";

const NOTION_GUIDE_URL = "https://www.notion.so/2b70001b5129804c9c26e53b09be12c5?source=copy_link"; // 실제 노션 주소로 변경

const FloatingGuideButton: React.FC = () => {
  return (
    <Button
      variant="trialStart"
      onClick={() => window.open(NOTION_GUIDE_URL, "_blank")}
      className="
        fixed
        bottom-4 right-4
        md:bottom-8 md:right-8
        z-50
        rounded-full shadow-lg
        p-2 md:p-4
        flex items-center justify-center
        font-bold
        text-xs md:text-base
      "
      style={{ minWidth: 36, minHeight: 36 }}
      aria-label="이용가이드 열기"
    >
      {/* 모바일: 책 아이콘만 */}
      <span className="block md:hidden">
        <FaBook size={20} />
      </span>
      {/* 데스크탑: 책 아이콘 + 텍스트 한 줄 */}
      <span className="hidden md:flex items-center gap-2">
        <FaBook size={20} />
        땅땅땅 이용가이드
      </span>
    </Button>
  );
};

export default FloatingGuideButton;
