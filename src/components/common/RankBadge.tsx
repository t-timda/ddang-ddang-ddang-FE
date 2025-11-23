// src/components/common/RankBadge.tsx
import React from "react";
import { getRankNicknameFrame } from "@/utils/rankImageMapper";

interface RankBadgeProps {
  rank: string;
  nickname: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const RankBadge: React.FC<RankBadgeProps> = ({ 
  rank, 
  nickname, 
  size = "md",
  className = ""
}) => {
  const frameImage = getRankNicknameFrame(rank);
  
  // 파트너 변호사는 흰색 텍스트
  const isPartnerLawyer = rank === "파트너 변호사";
  const textColorClass = isPartnerLawyer ? "text-white" : "text-main";
  
  // 크기별 스타일 정의
  const sizeStyles = {
    sm: {
      container: "h-5 md:h-6 min-w-[64px] max-w-[160px]",
      text: "text-[7px] md:text-[9px]",
      padding: "px-3 md:px-4"
    },
    md: {
      container: "h-6 md:h-8 min-w-[80px] max-w-[200px]",
      text: "text-[8px] md:text-[10px]",
      padding: "px-4 md:px-6"
    },
    lg: {
      container: "h-8 md:h-10 min-w-[100px] max-w-[240px]",
      text: "text-[10px] md:text-xs",
      padding: "px-5 md:px-7"
    }
  };

  const styles = sizeStyles[size];

  return (
    <div className={`relative inline-flex items-center ${styles.container} ${className}`}>
      <img 
        src={frameImage} 
        alt={rank}
        className="absolute inset-0 w-full h-full object-fill"
      />
      <div className={`relative z-10 w-full flex items-center justify-center ${styles.padding}`}>
        <p className={`${textColorClass} font-bold text-center whitespace-nowrap ${styles.text}`}>
          {rank} {nickname}
        </p>
      </div>
    </div>
  );
};

export default RankBadge;