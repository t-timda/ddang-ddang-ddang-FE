import React from "react";
import { useNavigate } from "react-router-dom";
import { PATH_BUILDERS } from "@/constants";
import LawIcon from "@/assets/svgs/law.svg?react";

type Debate = {
  id: number;
  title: string;
  participants: number;
};

type HotDebateCardProps = {
  debate: Debate;
};

const HotDebateCard = ({ debate }: HotDebateCardProps) => {
  const navigate = useNavigate();
  const titleParts = debate.title.split("VS");

  const handleCardClick = () => {
    navigate(PATH_BUILDERS.debateDetail(debate.id));
  };

  return (
    <div
      onClick={handleCardClick}
      className="
        bg-[#C0DCFF]
        rounded-[29px]
        pt-[4px] pb-[24px] px-[6px]
        w-full
        cursor-pointer
        flex items-center justify-center
      "
    >
      <div
        className="
          bg-white
          rounded-[24px]
          w-full
          h-[206px]
          p-[24px]
          relative
          flex flex-col
        "
      >
        {/* 제목 영역 */}
        <div className="flex flex-col space-y-0.5">
          {titleParts.map((part, index) => (
            <React.Fragment key={index}>
              <p
                className="text-left text-main font-bold text-lg leading-snug truncate"
                title={part.trim()}
              >
                {part.trim()}
              </p>

              {index === 0 && (
                <p className="text-left font-bold text-sm text-main my-1">VS</p>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* 설명 */}
        <p className="text-left text-sm text-main mt-4">
          재판에 참여해서 변론을 작성하고, 당신의 논리를 펼쳐보세요!
        </p>

        {/* 참여자 수 */}
        <div className="flex gap-2 absolute bottom-[24px] right-[24px]">
          <LawIcon />
          <p className="text-right text-xs text-main-medium font-semibold">
            참여 중인 변호사 {debate.participants}명
          </p>
        </div>
      </div>
    </div>
  );
};

export default HotDebateCard;
