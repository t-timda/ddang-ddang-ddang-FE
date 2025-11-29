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
      container: "h-5 md:h-6 min-w-[50px] max-w-[120px]",
      text: "text-[7px] md:text-[9px]",
      padding: "px-2 md:px-3",
      nicknameText: "text-xs md:text-sm"
    },
    md: {
      container: "h-6 md:h-8 min-w-[60px] max-w-[140px]",
      text: "text-[8px] md:text-[10px]",
      padding: "px-3 md:px-4",
      nicknameText: "text-sm md:text-base"
    },
    lg: {
      container: "h-8 md:h-10 min-w-[80px] max-w-[160px]",
      text: "text-[10px] md:text-xs",
      padding: "px-4 md:px-5",
      nicknameText: "text-base md:text-lg"
    }
  };

  const styles = sizeStyles[size];

  return (
    <div className={`flex items-center gap-2 min-w-0 ${className}`}>
      {/* 명패 (칭호만) */}
      <div className={`relative inline-flex items-center ${styles.container}`}>
        <img 
          src={frameImage} 
          alt={rank}
          className="absolute inset-0 w-full h-full object-fill"
        />
        <div className={`relative z-10 w-full flex items-center justify-center ${styles.padding}`}>
          <p className={`${textColorClass} font-bold text-center whitespace-nowrap ${styles.text}`}>
            {rank}
          </p>
        </div>
      </div>
      
      {/* 닉네임 (명패 밖) */}
      <span className={`font-semibold text-main truncate ${styles.nicknameText}`}>
        {nickname}
      </span>
    </div>
  );
};

export default RankBadge;