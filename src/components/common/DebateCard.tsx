import React from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 훅 임포트
import { PATH_BUILDERS } from "@/constants";
import LawIcon from "@/assets/svgs/law.svg?react";
import clsx from "clsx"; // clsx 임포트 추가

type Debate = {
  id: number;
  title: string;
  // ⭐️ 참여자 수 필드 타입 명확히 지정
  participants: number; 
};

type HotDebateCardProps = {
  debate: Debate;
};

const HotDebateCard = ({ debate }: HotDebateCardProps) => {
  const navigate = useNavigate(); // useNavigate 훅 초기화
  
  // 제목을 'VS' 기준으로 분리합니다. 
  const titleParts = debate.title.split("VS");

  // 클릭 이벤트 핸들러
  const handleCardClick = () => {
    // debate.id를 사용하여 동적 URL로 페이지 이동
    navigate(PATH_BUILDERS.debateDetail(debate.id));
  };

  return (
    <div
      onClick={handleCardClick} // onClick 이벤트 핸들러 연결
      className={clsx(
        "inline-flex flex-col flex-shrink-0 bg-white rounded-[30px] cursor-pointer text-black transition-shadow duration-300 relative",
        "p-[27px] hover:shadow-xl" // padding을 내부 요소 정렬에 맞게 조정
      )}
      style={{
        width: '340px',
        height: '250px',
      }}
    >
      {/* ⭐️ 1. 제목 영역 (좌상단 정렬) - 반복은 여기서 끝납니다. */}
      <div className="flex flex-col space-y-0.5">
          {titleParts.map((part, index) => (
            <React.Fragment key={index}>
              {/* 첫 번째 부분 */}
              <p className="text-left text-main font-bold text-lg leading-snug truncate" title={part.trim()}>
                {part.trim()}
              </p>
              {/* 두 부분 사이에만 'VS'를 삽입 */}
              {index === 0 && (
                <p className="text-left font-bold text-sm text-main my-1">
                  VS
                </p>
                )
              }
            </React.Fragment>
          ))}
      </div>

      {/* ⭐️ 2. 상세 설명 문구 (map 바깥으로 이동하여 한 번만 출력) */}
      <p className="text-left text-sm text-main mt-4">
          재판에 참여해서 변론을 작성하고, 당신의 논리를 펼쳐보세요!
      </p>

      {/* ⭐️ 3. 참여자 수 (우측 하단 절대 위치) (map 바깥으로 이동하여 한 번만 출력) */}
      <div className="flex gap-2 absolute bottom-[27px] right-[27px]">
          <LawIcon/>
          <p className="text-right text-xs text-main-medium font-semibold">
          참여 중인 변호사 {debate.participants || 0}명
          </p>
      </div>
    </div>
  );
};

export default HotDebateCard;
