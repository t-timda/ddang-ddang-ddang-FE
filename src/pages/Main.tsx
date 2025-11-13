// src/pages/MainPage.tsx

import React, { useState, useCallback } from "react";
import Button from "@/components/common/Button"; // 공통 Button 컴포넌트 임포트
import HotDebateCard from "@/components/common/DebateCard"; // HotDebateCard 컴포넌트 임포트
import Hammer from "@/assets/svgs/hammer.svg?react"; // 망치 이미지 임포트
import Left from "@/assets/svgs/Left.svg?react"; // 왼쪽 화살표 이미지 임포트
import Right from "@/assets/svgs/Right.svg?react"; // 오른쪽 화살표 이미지 임포트
import firstJudgeIllustrationUrl from "@/assets/svgs/FirstJudge.svg?url";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/constants";

// API로부터 받아올 더미 데이터 (총 7개)
const hotDebates = [
  { id: 1, title: "짜장면 VS 짬뽕", participants: 120 },
  { id: 2, title: "민트초코 VS 반민트초코", participants: 85 },
  { id: 3, title: "부먹 VS 찍먹", participants: 95 },
  { id: 4, title: "바다 VS 산", participants: 110 },
  { id: 5, title: "수도권 VS 지방 이사 논쟁", participants: 77 }, // 추가 더미 데이터
  { id: 6, title: "커피 VS 탄산음료", participants: 99}, // 추가 더미 데이터
  { id: 7, title: "라면 VS 떡볶이", participants: 54 }, // 추가 더미 데이터
];

// 캐러셀 계산을 위한 상수 (HotDebateCard.tsx와 스타일을 맞춰야 함)
const CARD_WIDTH = 340; // HotDebateCard의 width
const CARD_GAP = 16; // Tailwind의 space-x-4에 해당하는 gap (4*0.25rem = 1rem = 16px)
const VISIBLE_COUNT = 4;
const TOTAL_DEBATES = hotDebates.length;

const MainPage = () => {
  // 현재 캐러셀의 시작 인덱스 (0, 1, 2...로 이동)
  const [startIndex, setStartIndex] = useState(0);

  // 이전 슬라이드로 1개씩 이동 (0보다 작아지지 않도록 제한)
  const handlePrevSingle = useCallback(() => {
    setStartIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    console.log("이전 슬라이드 클릭"); // ⭐️ 콘솔 로그 유지
  }, []);

  // 다음 슬라이드로 1개씩 이동 (마지막 카드가 보일 수 있는 최대 인덱스까지만 이동)
  const handleNextSingle = useCallback(() => {
    setStartIndex((prevIndex) =>
      Math.min(prevIndex + 1, TOTAL_DEBATES - VISIBLE_COUNT)
    );
    console.log("다음 슬라이드 클릭"); // ⭐️ 콘솔 로그 추가
  }, []);

  // 캐러셀 이동 거리 계산 (startIndex * (카드 너비 + 간격))
  const translateSingleValue = -(startIndex * (CARD_WIDTH + CARD_GAP));

  // 캐러셀 뷰포트 너비 계산 (4개의 카드와 그 사이 3개의 간격)
  const containerWidth =
    CARD_WIDTH * VISIBLE_COUNT + CARD_GAP * (VISIBLE_COUNT - 1);

  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen">
      {/* 1 & 2. 상단 및 로그인/로그아웃 영역 통합 */}
      <section className="flex items-start pl-[120px] pr-[120px] pt-24 gap-[30px]">
        {/* 왼쪽 섹션: 슬로건 & 로그인 박스 */}
        <div className="flex flex-col gap-[32px]">
          {/* 일상의 고민, AI와 함께 재판해보세요 부분 스타일 적용 */}
          <h1 className="text-main font-bold text-[36px] leading-[150%]">
            일상의 고민, <br />
            AI와 함께 재판해보세요
          </h1>
          {/* 로그인 박스 */}
          <div className="w-full">
            <div className="bg-main px-[35px] py-[44px] rounded-2xl w-[380px] h-[369px]">
              <div className="flex flex-col gap-6">
                {/* LOGIN 라벨 */}
                <div className="flex gap-2 items-center mb-2">
                  <label className="text-[20px] text-white">로그인</label>
                  <Hammer/>
                </div>

                {/* 아이디 섹션 */}
                <div className="w-full text-left">
                  <input
                    type="text"
                    id="id"
                    placeholder="ID"
                    className="bg-main-bright text-main font-bold h-15 w-full px-3 py-2 mt-1 rounded-md focus:outline-none disabled:bg-gray-100"
                  />
                </div>

                {/* 비밀번호 섹션 */}
                <div className="w-full mt-0 text-left">
                  <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    className="bg-main-bright text-main font-bold h-15 w-full px-3 py-2 mt-1 rounded-md focus:outline-none disabled:bg-gray-100"
                  />
                </div>

                {/*회원가입 및 로그인 버튼 */}
                <div className="flex justify-between items-center">
                  <Button variant="ghost" className="text-white hover:underline">
                    회원가입
                  </Button>
                  <Button 
                    variant="primary"
                    className="px-10 py-2 rounded-md" 
                    onClick={() => {
                      console.log("로그인 버튼 클릭");
                      // navigate(PATHS.LOGIN); // 실제 로그인 페이지 이동 로직
                    }}
                  >
                    로그인
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽 섹션: 밸런스 재판 시작하기 패널 */}
        <div
          className="flex-1 bg-[#6596DA] rounded-2xl p-[64px] w-[790px] h-[509px] relative transition" // 클릭 가능하도록 커서/효과 추가
        >
          <h2 className="text-3xl font-bold text-white">AI판사와 밸런스 재판</h2>
          <p className="mt-4 text-sm text-white">
            일상 속 사소한 논쟁이 가장 치열한 토론 배틀이 됩니다.
          </p>
          <p className="text-sm text-white">
            AI판사와 배심원들 앞에서 논리를 증명하고 승리하세요.
          </p>
          {/* 패널 내 콘텐츠는 여기에 추가 */}
          <Button
            variant="white"
            size="lg"
            className="mt-55 px-[109px] py-[24px] rounded-3xl cursor-pointer hover:opacity-90"
            onClick={() => navigate(PATHS.FIRST_TRIAL)} // 솔로모드, vs 모드 선택 페이지로 이동
          >
            재판 시작하기
          </Button>
          <img
            src={firstJudgeIllustrationUrl}
            alt="판사 아이콘"
            className="absolute bottom-0 right-10 w-[55%] max-w-md h-auto"
          />
        </div>
      </section>

      {/* 3. 인기 재판 목록 */}
      <section className="bg-main-bright pt-8 pb-20 mt-16 mb-20">
        {/*제목 및 전체재판 보기*/}
        <div className="flex pl-[120px] pr-[120px] justify-between items-center pt-10">
          <h2 className="text-2xl font-bold text-main">현재 진행중인 가장 핫한 재판에 참여해보세요</h2>
          <Button variant="bright_main" className="cursor-pointer px-[60px] py-[19px]">
            전체 재판 보기
          </Button>
        </div>
        <p className="pl-[120px] pr-[120px] text-main-medium mb-10">재판에 참여해서 변론을 작성하고, 당신의 논리를 펼쳐보세요!</p>

        {/* 캐러셀 본체 - 화살표와 카드 목록을 분리하여 정렬 */}
        <div className="flex pl-[120px] pr-[120px] justify-between items-center pt-10">
          {/* 왼쪽 버튼 영역 (120px 여백 역할) */}
          <div className="flex justify-start flex-shrink-0">
            <Button
              onClick={handlePrevSingle}
              variant="white"
              disabled={startIndex === 0}
              className="rounded-full w-13 h-13"
            >
              <Left className="w-6 h-6" title="이전 논쟁" />
            </Button>
          </div>

          {/* 캐러셀 뷰포트 (4개 카드만 보이도록 정확히 너비 지정) */}
          <div
            className="overflow-hidden"
            style={{ width: `${containerWidth}px` }}
          >
            <div
              className="flex transition-transform duration-500"
              style={{
                transform: `translateX(${translateSingleValue}px)`,
                gap: `${CARD_GAP}px`,
              }}
            >
              {/* map 함수를 이용해 데이터 렌더링 */}
              {hotDebates.map((debate) => (
                <HotDebateCard key={debate.id} debate={debate} />
              ))}
            </div>
          </div>

          {/* 오른쪽 버튼 영역 (120px 여백 역할) */}
          <div className="flex justify-end flex-shrink-0">
            <Button
              onClick={handleNextSingle}
              variant="white"
              className="rounded-full w-13 h-13 cursor-pointer"
            >
              <Right className="w-6 h-6" title="다음 논쟁" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MainPage;
