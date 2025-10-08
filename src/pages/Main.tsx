// src/pages/MainPage.tsx

import React, { useState, useCallback } from 'react';
import Button from '@/components/common/Button';
import Textarea from '@/components/common/textarea';
import HotDebateCard from '@/components/common/DebateCard'; // HotDebateCard 컴포넌트 임포트
import Left from '@/assets/svgs/Left.svg'; // 왼쪽 화살표 이미지 임포트
import Right from '@/assets/svgs/Right.svg'; // 오른쪽 화살표 이미지 임포트

// API로부터 받아올 더미 데이터 (총 7개)
const hotDebates = [
  { id: 1, title: "짜장면 VS 짬뽕" },
  { id: 2, title: "민트초코 VS 반민트초코" },
  { id: 3, title: "부먹 VS 찍먹" },
  { id: 4, title: "바다 VS 산" },
  { id: 5, title: "수도권 VS 지방 이사 논쟁" }, // 추가 더미 데이터
  { id: 6, title: "커피 VS 탄산음료" },      // 추가 더미 데이터
  { id: 7, title: "라면 VS 떡볶이" },        // 추가 더미 데이터
];

// 캐러셀 계산을 위한 상수 (HotDebateCard.tsx와 스타일을 맞춰야 함)
const CARD_WIDTH = 285;   // HotDebateCard의 width
const CARD_GAP = 16;      // Tailwind의 space-x-4에 해당하는 gap (4*0.25rem = 1rem = 16px)
const VISIBLE_COUNT = 4;
const TOTAL_DEBATES = hotDebates.length;

const MainPage = () => {
  // 현재 캐러셀의 시작 인덱스 (0, 1, 2...로 이동)
  const [startIndex, setStartIndex] = useState(0); 

  // 이전 슬라이드로 1개씩 이동 (0보다 작아지지 않도록 제한)
  const handlePrevSingle = useCallback(() => {
    setStartIndex(prevIndex => Math.max(prevIndex - 1, 0));
  }, []);

  // 다음 슬라이드로 1개씩 이동 (마지막 카드가 보일 수 있는 최대 인덱스까지만 이동)
  const handleNextSingle = useCallback(() => {
    setStartIndex(prevIndex => Math.min(prevIndex + 1, TOTAL_DEBATES - VISIBLE_COUNT));
  }, []);

  // 캐러셀 이동 거리 계산 (startIndex * (카드 너비 + 간격))
  const translateSingleValue = -(startIndex * (CARD_WIDTH + CARD_GAP));

  // 캐러셀 뷰포트 너비 계산 (4개의 카드와 그 사이 3개의 간격)
  const containerWidth = (CARD_WIDTH * VISIBLE_COUNT) + (CARD_GAP * (VISIBLE_COUNT - 1));

  return (
    <div className="bg-white min-h-screen">
      {/* 1 & 2. 상단 및 로그인/로그아웃 영역 통합 */}
      <section className="flex items-start pl-[120px] pr-[120px] pt-24 gap-[30px]">
        {/* 왼쪽 섹션: 슬로건 & 로그인 박스 */}
        <div className="flex flex-col gap-[64px]">
          {/* 일상의 고민, AI와 함께 재판해보세요 부분 스타일 적용 */}
          <h1 className="text-[#000] font-bold text-[36px] leading-[150%]">
            일상의 고민, <br />AI와 함께 재판해보세요
          </h1>
          {/* 로그인 박스 */}
          <div className="w-full">
            <div className="bg-[#DDD] p-6 rounded-2xl w-[380px] h-[292px]">
              <div className="flex flex-col gap-8">
                {/* LOGIN 라벨 */}
                <label className="text-[20px] text-black">LOGIN</label>

                {/* 아이디 섹션 */}
                <div className="w-full text-left text-black">
                  <input
                    type="text"
                    id="id"
                    placeholder="ID"
                    className="bg-white h-15 w-full px-3 py-2 mt-1 rounded-md focus:outline-none disabled:bg-gray-100"
                  />
                </div>

                {/* 비밀번호 섹션 */}
                <div className="w-full mt-0 text-left">
                  <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    className="bg-white h-15 w-full px-3 py-2 mt-1 rounded-md focus:outline-none disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 오른쪽 섹션: 밸런스 재판 시작하기 패널 */}
        <div className="flex-1 bg-[#DDD] rounded-2xl p-[64px] h-[470px] relative">
          <h2 className="text-3xl font-bold">밸런스 재판 시작하기</h2>
          {/* 패널 내 콘텐츠는 여기에 추가 */}
        </div>
      </section>

      {/* 3. 인기 재판 목록 */}
      <section className="bg-[#DDD] pt-8 pb-20 mt-16 mb-20">
        <div className="flex pl-[120px] pr-[120px] justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">현재 가장 핫한 재판</h2>
          <Button variant="ghost" className="hover:underline">더보기</Button>
        </div>
        
        {/* 캐러셀 본체 - 화살표와 카드 목록을 분리하여 정렬 */}
        <div className="flex items-center justify-center"> 
            
            {/* 왼쪽 버튼 영역 (120px 여백 역할) */}
            <div className="flex justify-start w-[120px] flex-shrink-0"> 
                <Button 
                    onClick={handlePrevSingle}
                    variant="ghost" 
                    disabled={startIndex === 0}
                >
                    <img src={Left} alt="이전 논쟁" className="w-8 h-8" />
                </Button>
            </div>

            {/* 캐러셀 뷰포트 (4개 카드만 보이도록 정확히 너비 지정) */}
            <div className="overflow-hidden" style={{ width: `${containerWidth}px` }}>
                <div 
                    className="flex transition-transform duration-500" 
                    style={{ 
                        transform: `translateX(${translateSingleValue}px)`,
                        gap: `${CARD_GAP}px`
                    }}
                >
                    {/* map 함수를 이용해 데이터 렌더링 */}
                    {hotDebates.map(debate => (
                        <HotDebateCard key={debate.id} debate={debate} />
                    ))}
                </div>
            </div>

            {/* 오른쪽 버튼 영역 (120px 여백 역할) */}
            <div className="flex justify-end w-[120px] flex-shrink-0">
                <Button 
                    onClick={handleNextSingle}
                    variant="ghost" 
                    disabled={startIndex >= TOTAL_DEBATES - VISIBLE_COUNT}
                >
                    {/* import한 Right 이미지 사용 */}
                    <img src={Right} alt="다음 논쟁" className="w-8 h-8"/>
                </Button>
            </div>
            
        </div>
      </section>
    </div>
  );
};

export default MainPage;