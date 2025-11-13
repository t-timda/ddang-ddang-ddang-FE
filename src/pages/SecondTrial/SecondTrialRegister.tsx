// src/pages/SecondTrialPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/common/Button";
import { PATHS } from "@/constants";

// 더미 데이터 및 상수
const MOCK_DEBATE_DATA = {
  id: 1,
  timeLimit: '마감',
  situation: '깻잎 논쟁: 내 연인이 친구의 깻잎을 떼어주는 것을 허용해야 하는가?',
  argumentA: '연인을 배려하는 행동이며, 사소한 일에 질투하는 것은 속이 좁은 것이다.',
  argumentB: '연인과 친구 사이에 무의식적인 친밀감을 형성하는 행동이며, 오해의 소지가 있다.',
  isArgumentTime: false, // ⭐️ [추가] 변론/대댓글 가능 시간 여부 (true = 마감 전)
  isVoteTime: false,       // ⭐️ [추가] 투표 가능 시간 여부 (true = 마감 전)
};

const SecondTrialRegister: React.FC = () => {
  const [duration, setDuration] = useState<string>('');
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center pt-10 gap-y-10">
      <h1 className="text-2xl font-bold text-center text-main">
        2차 재판 등록
      </h1>

      <div className="flex gap-[31px]">
        <div className="w-[513px] h-[447px] bg-main-medium rounded-[30px] flex justify-center items-center flex-col">
          <span className="text-2xl font-bold text-center text-white">
            A. 찬성 {/* api 통해 값 넣기 */}
          </span>
          <p className="px-20 py-10 text-white">{MOCK_DEBATE_DATA.argumentA}</p>
        </div>
        <div className="w-[513px] h-[447px] bg-main-red rounded-[30px] flex justify-center items-center flex-col">
          <span className="text-2xl font-bold text-center text-white">
            B. 반대 {/* api 통해 값 넣기 */}
          </span>
          <p className="px-20 py-10 text-white">{MOCK_DEBATE_DATA.argumentB}</p>
        </div>
      </div>

      
      <div className="w-[1058px] flex justify-center items-center pb-6">
        <h1 className="text-main text-24px">{MOCK_DEBATE_DATA.situation}</h1>
      </div>
      

      <h1 className="text-2xl font-bold text-center text-main">
        변호 종료 시간 설정
      </h1>

      <select
        id="durationSelect"
        value={duration}
        onChange={e => setDuration(e.target.value)}
        className="
          w-[585px] h-[123px]
          bg-main-bright
          rounded-[30px]
          text-lg font-bold text-center
          flex items-center justify-center
          focus:outline-none focus:ring-2 focus:ring-main-medium
          text-main
        "
      >
        <option value="">시간 선택</option>
        <option value="1">1시간</option>
        <option value="2">2시간</option>
        <option value="3">3시간</option>
        <option value="12">12시간</option>
        <option value="24">24시간</option>
        <option value="48">48시간</option>
        <option value="72">72시간</option>
      </select>

      <Button
        variant="primary"
        size="lg"
        className="w-[585px] h-[123px] rounded-[30px]"
        onClick={() => navigate(PATHS.SECOND_TRIAL_ROUND_ONE)}
      >
        2차 재판 시작하기
      </Button>
    </div>
  );
};

export default SecondTrialRegister;