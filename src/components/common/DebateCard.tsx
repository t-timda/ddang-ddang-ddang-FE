import React from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 임포트

type Debate = {
  id: number;
  title: string;
};

type HotDebateCardProps = {
  debate: Debate;
};

const HotDebateCard = ({ debate }: HotDebateCardProps) => {
  const navigate = useNavigate(); // useNavigate 훅 초기화
  
  // 제목을 'VS' 기준으로 분리합니다. (예: ["밥 손으로 처먹는 남친 ", " 칼로 썰어 먹는 남친"])
  const titleParts = debate.title.split('VS');

  // 클릭 이벤트 핸들러
  const handleCardClick = () => {
    // debate.id를 사용하여 동적 URL로 페이지 이동
    navigate(`/debate/${debate.id}`);
  };

  return (
    <div
      onClick={handleCardClick} // onClick 이벤트 핸들러 연결
      className="inline-flex flex-col justify-center items-center flex-shrink-0 bg-white rounded-[30px] cursor-pointer text-black overflow-hidden"
      style={{
        width: '285px',
        height: '215px',
        padding: '30px 20px', // 패딩을 조정하여 텍스트 공간 확보
      }}
    >
      {/* 제목 렌더링: 
        1. 텍스트 분리 후 각 부분을 <p>로 감싸고
        2. 'VS' 텍스트를 가운데에 배치하여 3줄 구성 (가변적인 텍스트 길이에 대응)
      */}
      {titleParts.map((part, index) => (
        <React.Fragment key={index}>
          {/* 첫 번째 부분 */}
          <p className="text-center font-semibold text-base leading-snug break-words">
            {part.trim()}
          </p>
          {/* 두 부분 사이에만 'VS'를 삽입 */}
          {index === 0 && (
            <p className="text-center font-bold text-sm text-black my-1">
              VS
            </p>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default HotDebateCard;