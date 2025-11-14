import React, { useState, useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import { PATHS } from '@/constants';
import clsx from 'clsx';
import Button from '@/components/common/Button';

const MOCK_VOTE_RESULT = {
  voteA: 62, // A측 투표율 (62%)
  voteB: 38, // B측 투표율 (38%)
};
// 더미 데이터 및 상수
const MOCK_DEBATE_DATA = {
  id: 1,
  timeLimit: '재판종료', // 마감 상태를 명확히 표시
  situation: '깻잎 논쟁: 내 연인이 친구의 깻잎을 떼어주는 것을 허용해야 하는가?',
  argumentA: '연인을 배려하는 행동이며, 사소한 일에 질투하는 것은 속이 좁은 것이다.',
  argumentB: '연인과 친구 사이에 무의식적인 친밀감을 형성하는 행동이며, 오해의 소지가 있다.',
  isArgumentTime: false, // 변론/대댓글 가능 시간 여부 (false = 마감)
  isVoteTime: false,       // 투표 가능 시간 여부 (false = 마감)
};


const SecondTrial_final = () => {
  const navigate = useNavigate();
  // 2차 재판 결과가 확정된 후, 3차 투표를 위해 선택 상태만 임시로 유지
  const [selectedSide, setSelectedSide] = useState<'A' | 'B' | null>(null);
    
  return (
    <div className="bg-white min-h-screen pt-12 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* 1. 헤더 및 타이머 (마감 상태) */}
        <div className="flex justify-between items-center pb-4 mb-6 ">
          <h1 className="text-3xl font-bold text-main">2차 재판</h1>
          <span className="bg-[#FFE5E5] p-4 rounded-lg text-md font-medium text-main-red">{MOCK_DEBATE_DATA.timeLimit}</span>
        </div>

        {/* 2. 상황 설명 */}
        <p className="font-medium mb-8 text-main">{MOCK_DEBATE_DATA.situation}</p>

        {/* 3. 최종 심의 대상 카드 (2차 재판 결과 표시 예정) */}
        <div className="flex space-x-8 justify-center mb-12">
          
          {/* A. 찬성 블록 (결과 확정) */}
          <div 
            className={clsx(
              "w-[513px] h-[447px] bg-main-medium rounded-[30px] flex justify-center items-center flex-col",
              // 3차 심의에서는 투표가 불가능하므로 비활성화 스타일 유지
              'cursor-default opacity-70 border-gray-300' 
            )}
          >
            <span className="text-2xl font-bold text-center text-white">
              A. 찬성 {/* api 통해 값 넣기 */}
            </span>
            <p className="px-20 py-10 text-white">{MOCK_DEBATE_DATA.argumentA}</p>
          </div>
          
          {/* B. 반대 블록 (결과 확정) */}
          <div 
            className={clsx(
              "w-[513px] h-[447px] bg-main-red rounded-[30px] flex justify-center items-center flex-col",
              'cursor-default opacity-70 border-gray-300'
            )}
          >
            <span className="text-2xl font-bold text-center text-white">
              B. 찬성 {/* api 통해 값 넣기 */}
            </span>
            <p className="px-20 py-10 text-white">{MOCK_DEBATE_DATA.argumentB}</p>
          </div>
        </div>
        
        {/* 4. 최종 투표 결과 바 (추가된 부분) */}
        <div className="flex flex-col items-center mb-12 pt-8">
            <h2 className="text-2xl font-bold text-main mb-6">2차 재판 투표 결과</h2>
            
            {/* 비율 바 컨테이너 */}
            <div className="w-full max-w-xl h-10 bg-gray-200 rounded-full flex overflow-hidden">
                {/* A측 비율 (파란색) */}
                <div 
                    style={{ width: `${MOCK_VOTE_RESULT.voteA}%` }}
                    className="bg-main-medium flex justify-center items-center text-white font-bold text-sm h-full"
                >
                    {/* A측 비율 텍스트 */}
                    {MOCK_VOTE_RESULT.voteA > 5 && (
                        <span>A측 입장 {MOCK_VOTE_RESULT.voteA}%</span>
                    )}
                </div>
                
                {/* B측 비율 (빨간색) */}
                <div 
                    style={{ width: `${MOCK_VOTE_RESULT.voteB}%` }}
                    className="bg-main-red flex justify-center items-center text-white font-bold text-sm h-full"
                >
                    {/* B측 비율 텍스트 */}
                    {MOCK_VOTE_RESULT.voteB > 5 && (
                        <span>B측 입장 {MOCK_VOTE_RESULT.voteB}%</span>
                    )}
                </div>
                
                {/* 비율이 너무 작아서 텍스트가 안 보일 경우를 대비한 처리 */}
                {MOCK_VOTE_RESULT.voteA <= 5 && MOCK_VOTE_RESULT.voteA > 0 && (
                     <div className="absolute left-0 transform translate-x-[calc(50%-50%)]">
                        <span className="text-black text-xs ml-1">A {MOCK_VOTE_RESULT.voteA}%</span>
                     </div>
                )}
                {MOCK_VOTE_RESULT.voteB <= 5 && MOCK_VOTE_RESULT.voteB > 0 && (
                     <div className="absolute right-0 transform translate-x-[calc(-50%+50%)]">
                        <span className="text-black text-xs mr-1">B {MOCK_VOTE_RESULT.voteB}%</span>
                     </div>
                )}
            </div>
            
        </div>
        
        {/* ⭐️ 최종심 결과보기 버튼 추가 */}
        <div className="mt-8 flex justify-center w-full">
            <Button 
                variant="trialStart"
                size="lg"
                onClick={() => navigate(PATHS.THIRD_TRIAL)} // 3차 재판 페이지로 이동
                className="w-[585px] h-[123px] rounded-[30px]" 
            >
                최종심 결과보기
            </Button>
        </div>

      </div>
    </div>
  );
}

export default SecondTrial_final; 