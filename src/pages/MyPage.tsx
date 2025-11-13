import React, { useState } from "react";
import Button from "@/components/common/Button"; 
import TrialListItem, { TrialData, TrialStatus } from "@/components/mypage/TrialListItem"; 
import judgeIllustrationUrl from "@/assets/svgs/FirstJudge.svg?url"; 
import ProfileIcon from "@/assets/svgs/profileIcon.svg?react";
import { useMemo } from "react";

// 나중에 별도 컴포넌트로 분리할 섹션들을 일단 MyPage 컴포넌트 내부에 직접 구현
const MyPage = () => {
  // 실제 데이터는 API 연동 후 useState로 관리하게 됩니다.
  const [userName] = useState("명예 변호사"); // 와이어프레임 'OOO님의 법정' 위의 OOO 부분
  const [wins] = useState(10);
  const [losses] = useState(5);
  const [nickname, setNickname] = useState("OO");
  const [email, setEmail] = useState("mutsa@example.com");
  const [phoneNumber, setPhoneNumber] = useState("010-1234-5678");

  // 경험치 및 칭호 관련 더미 데이터
  const expData = {
    currentLevel: "법대생",
    nextLevel: "로스쿨 학생",
    totalExp: 18, // 현재까지 진행한 재판 수
    expNeeded: 7, // 다음 레벨까지 남은 재판 수
    expProgress: 65, // 경험치 진행률 (65% 가정)
  };

  //전적 조회 더미 데이터
  const DUMMY_TRIALS: TrialData[] = [
    { id: 105, title: "다른 이성에게 깻잎을 떼어줘도 된다 VS 안된다", mySide: "안된다", status: '승리', currentRound: '진행중' },
    { id: 104, title: "짜장면 VS 짬뽕", mySide: "짬뽕", status: '패배', currentRound: '종료' },
    { id: 103, title: "부먹 VS 찍먹", mySide: "찍먹", status: '패배', currentRound: '종료' },
    { id: 102, title: "얼죽아 VS 듸쥭따", mySide: "얼죽아", status: '승리', currentRound: '종료' },
    { id: 101, title: "멋쟁이 사자처럼 VS 안 멋진 호랑이처럼", mySide: "멋쟁이 사자처럼", status: '진행중', currentRound: '진행중' },
  ];

  // 사이드바 메뉴 선택 상태
  // 'profile', 'exp', 'records', 'participate'
  const [selectedMenu, setSelectedMenu] = useState("profile"); 

  // 전적 조회 필터 상태
  const [sortType, setSortType] = useState<TrialStatus | '정렬'>('정렬');

  // 정렬/필터링 로직
  const filteredTrials = useMemo(() => {
    let list = [...DUMMY_TRIALS]; // ID 순서 유지를 위해 복사

    if (sortType === '정렬') {
        return list.sort((a, b) => b.id - a.id); // ID 역순 (최신순)
    }
    
    // 승리/패배/진행중 필터링
    return list.filter(trial => trial.status === sortType);
  }, [sortType]);


  const handleUpdateInfo = () => {
    // 여기에 API 호출 로직을 추가합니다.
    console.log("정보 수정하기 클릭! (데이터 업데이트)");
  };
  
  // 임시로 사용할 커스텀 Tailwind 클래스 (와이어프레임 색상 반영)
  const PROFILE_BG_COLOR = "bg-[#4A7AD8]"; // 프로필 섹션 배경색 (와이어프레임 블루)
  const PROFILE_ACCENT_COLOR = "text-[#E8F2FF]"; // 폰트 강조색 (밝은 색)

  return (
    <div className="min-h-screen bg-white py-12">
      {/* 전체 컨테이너: 중앙 정렬 및 최대 너비 설정, 자식 요소를 세로로 쌓음 */}
      <div className="max-w-6xl mx-auto px-4 flex flex-col"> 
        
        {/* 상단 섹션 (타이틀 및 프로필 배너 - 전체 너비) */}
        <div className="w-full">
          <h2 className="text-[38px] font-bold text-main mb-4 pb-2">
            마이페이지
          </h2>
          {/* 1. 상단 프로필 섹션 */}
          <div className={`${PROFILE_BG_COLOR} px-8 pt-4 rounded-xl flex items-center mb-10`}>
            <div className="flex-grow">
              {/* OOO님의 법정 위의 OOO 닉네임/등급 */}
              <p className={`${PROFILE_ACCENT_COLOR} text-md mb-1`}>
                {userName}
              </p>
              
              {/* OOO님의 법정 */}
              <h2 className="text-white text-3xl font-extrabold mb-2">
                {nickname}님의 법정
              </h2>

              {/* 승패 기록 */}
              <p className="text-white text-lg">
                <span className="font-bold">{wins}</span>승{" "}
                <span className="font-bold">{losses}</span>패
              </p>
            </div>
            {/* 판사 아이콘 */}
            <img
              src={judgeIllustrationUrl}
              alt="판사 아이콘"
              className="bottom-0 w-[201px] h-auto text-white "
            /> 
          </div>
        </div>

        {/* 하단 섹션 (사이드바 + 메인 콘텐츠 - Flex) */}
        <div className="flex w-full">
          {/* 왼쪽 사이드바 (W: 25%) */}
          <div className="w-1/4 pr-8 pt-8"> 
            <nav className="flex flex-col space-y-2">
              {/* 메뉴 그룹: 내 정보 조회/수정 */}
              <Button
                // variant에 삼항 연산자 적용
                variant={selectedMenu === "profile" ? "bright_main" : "ghost"} 
                className={`text-md transition duration-150 ease-in-out`}
                onClick={() => setSelectedMenu("profile")}
              >
                내 정보 조회/수정
              </Button>

              {/* 메뉴 그룹: 경험치 및 칭호 */}
              <Button
                // variant에 삼항 연산자 적용
                variant={selectedMenu === "exp" ? "bright_main" : "ghost"}
                className={`text-md transition duration-150 ease-in-out`}
                onClick={() => setSelectedMenu("exp")}
              >
                경험치 및 칭호 조회
              </Button>
              
              {/* 메뉴 그룹: 전적 조회 */}
              <Button
                // variant에 삼항 연산자 적용
                variant={selectedMenu === "achievements" ? "bright_main" : "ghost"}
                className={`text-md transition duration-150 ease-in-out`}
                onClick={() => setSelectedMenu("achievements")}
              >
                업적 조회하기
              </Button>

              {/* 메뉴 그룹: 전적 조회 */}
              <Button
                // variant에 삼항 연산자 적용
                variant={selectedMenu === "records" ? "bright_main" : "ghost"}
                className={`text-md transition duration-150 ease-in-out`}
                onClick={() => setSelectedMenu("records")}
              >
                전적 조회하기
              </Button>
              
              {/* 메뉴 그룹: 현재까지 참여한 재판 */}
              <Button
                // variant에 삼항 연산자 적용
                variant={selectedMenu === "participate" ? "bright_main": "ghost"}
                className={`text-md transition duration-150 ease-in-out`}
                onClick={() => setSelectedMenu("participate")}
              >
                현재까지 참여한 재판
              </Button>
            </nav>
          </div>

          {/* 오른쪽 메인 콘텐츠 (W: 75%) */}
          <div className="w-3/4 pl-8 pt-8">
            {/* 2. 사용자 정보 폼 (내 정보 조회/수정 탭 선택 시) */}
            {selectedMenu === "profile" && (
              <div>
                <h3 className="text-2xl font-bold text-main mb-6 border-b pb-2">
                    내 정보 수정
                </h3>

                {/* 프로필 사진 섹션 */}
                <div className="flex items-center space-x-6 mb-10">
                    {/* 프로필 사진 미리보기 (클래스 복원) */}
                    <ProfileIcon className="w-24 h-24 text-main bg-gray-100 rounded-full p-1" title="프로필 사진" />
                </div>

                {/* 닉네임 */}
                <div className="mb-6">
                  <label htmlFor="nickname" className="block text-main text-lg font-medium mb-2">
                    닉네임
                  </label>
                  <input
                    type="text"
                    id="nickname"
                    className="w-full border-b-2 border-main focus:border-main outline-none pb-2 text-lg text-main"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                  />
                </div>

                {/* 이메일 주소 */}
                <div className="mb-6">
                  <label htmlFor="email" className="block text-main text-lg font-medium mb-2">
                    이메일 주소
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full border-b-2 border-main focus:border-main outline-none pb-2 text-lg text-main"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    readOnly // 이메일은 보통 수정 불가
                  />
                </div>

                {/* 전화번호 */}
                <div className="mb-6">
                  <label htmlFor="phone" className="block text-main text-lg font-medium mb-2">
                    전화번호
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full border-b-2 border-main focus:border-main outline-none pb-2 text-lg text-gray-800"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>

                {/* 정보 수정하기 버튼 */}
                <div className="flex justify-end mt-10">
                  <Button
                    variant="primary" 
                    size="lg" 
                    className="px-8 py-3 rounded-md"
                    onClick={handleUpdateInfo}
                  >
                    정보 수정하기
                  </Button>
                </div>
              </div>
            )}
            
            {/* 경험치 및 칭호 조회 (Exp) 탭 */}
            {selectedMenu === "exp" && (
              <div className="pt-4">
                <h3 className="text-2xl font-bold text-main ">
                    현재 칭호
                </h3>
                <span className="text-main mb-6">{expData.currentLevel}</span>  
                
                {/* 다음 칭호까지 남은 재판 수 */}
                <p className="text-xl font-bold text-main mb-4 pt-8">
                    다음 칭호를 얻기까지 남은 재판 수 <span className="text-main">{expData.expNeeded}개</span>
                </p>
                <p className="text-md text-main mb-6">
                    다음 칭호: {expData.nextLevel}
                </p>

                {/* 경험치 진행률 바 */}
                <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                    <div 
                        className="bg-main h-4 rounded-full transition-all duration-500"
                        style={{ width: `${expData.expProgress}%` }}
                    ></div>
                </div>
                
                <p className="text-sm text-main mb-8">
                    현재까지 진행한 재판 수: {expData.totalExp}개
                </p>

                {/* 칭호 단계 히스토리 */}
                <h3 className="text-xl font-bold text-main mb-4 pb-2">
                    칭호 단계
                </h3>
                <p className="text-md text-main">
                    말싸움 고수 → 법대생 → 로스쿨 → 천원짜리 변호사 → 만원짜리 변호사
                </p>
              </div>
            )}
            
            {/* 업적 조회하기 (achivement)) 탭 - 와이어프레임 아직*/}
            {selectedMenu === "achievements" && (
              <div className="pt-4">
                <h3 className="text-2xl font-bold text-main mb-6 border-b pb-2">
                    업적 조회하기
                </h3>
                <div className="p-6 bg-gray-50 rounded-lg">
                    <p className="text-main-medium">여기에 사용자 업적(첫 재판 승리, 10번째 재판 승리 등)이 표시됩니다.</p>
                </div>
              </div>
            )}

            {/* 전적 조회하기 (Records) 탭 - 와이어프레임 아직*/}
            {selectedMenu === "records" && (
              <div className="pt-4">
                <h3 className="text-2xl font-bold text-main mb-6 border-b pb-2">
                    전적 조회하기
                </h3>
                <div className="p-6 bg-gray-50 rounded-lg">
                    <p className="text-main-medium">여기에 사용자 전적(승패 기록, 상세 재판 결과 등)이 표시됩니다.</p>
                </div>
              </div>
            )}

            {/* 4. 현재까지 참여한 재판 (Participate) 탭 */}
            {selectedMenu === "participate" && (
              <div className="pt-4">
                {/* 상단 정보 및 정렬 드롭다운 */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">
                        참여한 재판 목록 <span className="text-lg text-gray-500 font-normal">({DUMMY_TRIALS.length}개의 재판)</span>
                    </h3>
                    <select
                        value={sortType}
                        onChange={(e) => setSortType(e.target.value as TrialStatus | '정렬')}
                        className="p-2 rounded-md bg-main-bright text-main-medium cursor-pointer appearance"
                    >
                        <option value="정렬">정렬</option>
                        <option value="승리">승리</option>
                        <option value="패배">패배</option>
                        <option value="진행중">진행 중</option>
                    </select>
                </div>

                {/* ⭐️ 재판 목록 렌더링 */}
                <div className="space-y-2">
                    {filteredTrials.length > 0 ? (
                        filteredTrials.map(trial => (
                            <TrialListItem key={trial.id} trial={trial} />
                        ))
                    ) : (
                        <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg">
                            필터링된 재판이 없습니다.
                        </div>
                    )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
