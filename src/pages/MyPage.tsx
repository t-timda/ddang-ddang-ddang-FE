import React, { useState, useEffect, useRef, useMemo } from "react";
import Button from "@/components/common/Button"; 
import TrialListItem, { TrialData, CaseResult } from "@/components/mypage/TrialListItem"; 
import DefenseListItem from "@/components/mypage/DefenseListItem";
import Pagination from "@/components/vs-mode/Pagination";
import judgeIllustrationUrl from "@/assets/svgs/FirstJudge.svg?url"; 
import ProfileIcon from "@/assets/svgs/profileIcon.svg?react";
import ExpIcon from '@/assets/svgs/expIcon.svg?react';
import MedalIcon from '@/assets/svgs/medalIcon.svg?react';
import UserIcon from '@/assets/svgs/userIcon.svg?react';
import MypageHammerIcon from '@/assets/svgs/mypageHammerIcon.svg?react';
import { useUserProfileQuery, useUserRecordQuery, useUserAchievementsQuery, useUserRankQuery, useUserCasesQuery, useUpdateUserProfileMutation, useUploadProfileImageMutation } from "@/hooks/api/useUserQuery";
import { useMyDefensesQuery, useMyOngoingCasesQuery, useCasesResultsQuery } from "@/hooks/home/useHome";
import { useAuthStore } from "@/stores/useAuthStore";

const MyPage = () => {
  const authStore = useAuthStore();
  const isAuthenticated = !!authStore.accessToken;

  const { data: userData, isLoading, isError, error } = useUserProfileQuery({
      enabled: isAuthenticated, 
  });
  const { data: recordData } = useUserRecordQuery({ enabled: isAuthenticated });
  const { data: achievementsData } = useUserAchievementsQuery({ enabled: isAuthenticated });
  const { data: rankData } = useUserRankQuery({ enabled: isAuthenticated });
  const { data: casesData } = useUserCasesQuery({ enabled: isAuthenticated });
  
  // 새로 추가
  const { data: ongoingCasesData } = useMyOngoingCasesQuery(isAuthenticated);
  const { data: defensesData } = useMyDefensesQuery(isAuthenticated);

  const updateProfileMutation = useUpdateUserProfileMutation();
  const uploadImageMutation = useUploadProfileImageMutation();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (userData) {
      setNickname(userData.nickname);
      setEmail(userData.email);
      setPhoneNumber(userData.phone_number || "");
    }
  }, [userData]);

  const [selectedMenu, setSelectedMenu] = useState("profile"); 
  const [sortType, setSortType] = useState<CaseResult | '정렬'>('정렬');
  const [defenseSortType, setDefenseSortType] = useState<'정렬' | 'WIN' | 'LOSE' | 'PENDING' | 'LIKE'>('정렬');
  
  // 참여한 재판 탭: "전체" | "진행중" | "변호전적"
  const [participateTab, setParticipateTab] = useState<"전체" | "진행중" | "변호전적">("전체");
  
  // 페이지네이션
  const [allPage, setAllPage] = useState(1);
  const [ongoingPage, setOngoingPage] = useState(1);
  const [defensePage, setDefensePage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const wins = recordData?.result?.winCnt ?? 0;
  const losses = recordData?.result?.loseCnt ?? 0;

  const currentRank = rankData?.result?.rank ?? "로딩 중...";
  const currentExp = rankData?.result?.exp ?? 0;

  // 내가 생성한 재판 목록
  const trialListData: TrialData[] = useMemo(() => {
    return casesData?.result?.map(caseItem => ({
      id: caseItem.caseId,
      title: caseItem.title,
      mySide: caseItem.mainArguments[0] || "",
      status: caseItem.status,
      caseResult: caseItem.caseResult,
    })) ?? [];
  }, [casesData]);

  // 진행중인 재판 목록 (타입 포함)
  const ongoingTrialsWithType: Array<TrialData & { type: 'ongoing', mode?: string }> = useMemo(() => {
    return ongoingCasesData?.result?.map(caseItem => ({
      id: caseItem.caseId,
      title: caseItem.title,
      mySide: caseItem.mainArguments[0] || "",
      status: caseItem.status,
      caseResult: "PENDING" as CaseResult,
      type: 'ongoing' as const,
      mode: '솔로모드', // API에서 모드 정보가 없으면 기본값
    })) ?? [];
  }, [ongoingCasesData]);

  // 변호 전적 (변론 + 반론)
  const defenseListWithType = useMemo(() => {
    const defenses = defensesData?.result?.defenses ?? [];
    const rebuttals = defensesData?.result?.rebuttals ?? [];
    return [...defenses, ...rebuttals].map(d => ({ ...d, type: 'defense' as const }));
  }, [defensesData]);

  // 변호 전적의 모든 caseId 추출
  const defenseCaseIds = useMemo(() => {
    return [...new Set(defenseListWithType.map(d => d.caseId))];
  }, [defenseListWithType]);

  // 각 재판의 결과 가져오기
  const caseResultsQueries = useCasesResultsQuery(defenseCaseIds);
  
  // caseId -> caseResult 매핑
  const caseResultsMap = useMemo(() => {
    const map = new Map<number, { caseResult: CaseResult; status: string }>();
    caseResultsQueries.forEach((query) => {
      if (query.data) {
        map.set(query.data.caseId, {
          caseResult: query.data.caseResult as CaseResult,
          status: query.data.status
        });
      }
    });
    return map;
  }, [caseResultsQueries]);

  // 변호 전적에 재판 결과 추가
  const defenseListWithResult = useMemo(() => {
    return defenseListWithType.map(defense => ({
      ...defense,
      caseResult: caseResultsMap.get(defense.caseId)?.caseResult || 'PENDING' as CaseResult,
      caseStatus: caseResultsMap.get(defense.caseId)?.status || 'PENDING'
    }));
  }, [defenseListWithType, caseResultsMap]);

  // 전체: 진행중인 재판 + 변호전적 합치기
  const allItems = useMemo(() => {
    return [...ongoingTrialsWithType, ...defenseListWithType];
  }, [ongoingTrialsWithType, defenseListWithType]);

  // 필터링 (전체 탭에서만)
  const filteredAllItems = useMemo(() => {
    if (sortType === '정렬') return allItems;
    // 진행중인 재판만 필터링
    return allItems.filter(item => 
      item.type === 'ongoing' && (item as any).caseResult === sortType
    );
  }, [allItems, sortType]);

  // 진행중인 재판 필터링 추가 (파일 상단 useMemo 섹션에)
  const filteredOngoingTrials = useMemo(() => {
    if (sortType === '정렬') return ongoingTrialsWithType;
    return ongoingTrialsWithType.filter(trial => trial.caseResult === sortType);
  }, [ongoingTrialsWithType, sortType]);

  // 변호전적 필터링
  const filteredDefenseList = useMemo(() => {
    let list = [...defenseListWithResult];
    
    if (defenseSortType === 'LIKE') {
      // 좋아요순 정렬
      return list.sort((a, b) => b.likeCount - a.likeCount);
    }
    
    if (defenseSortType === 'WIN') {
      // 승리한 재판만
      return list.filter(d => d.caseResult === 'WIN');
    }
    
    if (defenseSortType === 'LOSE') {
      // 패배한 재판만
      return list.filter(d => d.caseResult === 'LOSE');
    }
    
    if (defenseSortType === 'PENDING') {
      // 진행중인 재판만
      return list.filter(d => d.caseResult === 'PENDING');
    }
    
    // 정렬 - 기본 순서
    return list;
  }, [defenseListWithResult, defenseSortType]);

  // 페이지네이션 적용
  const paginatedAllItems = useMemo(() => {
    const startIndex = (allPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAllItems.slice(startIndex, endIndex);
  }, [filteredAllItems, allPage]);

  const paginatedOngoingTrials = useMemo(() => {
    const startIndex = (ongoingPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredOngoingTrials.slice(startIndex, endIndex);
  }, [filteredOngoingTrials, ongoingPage]);

  const paginatedDefenseList = useMemo(() => {
    const startIndex = (defensePage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredDefenseList.slice(startIndex, endIndex);
  }, [filteredDefenseList, defensePage]);

  const allTotalPages = Math.ceil(filteredAllItems.length / ITEMS_PER_PAGE);
  const ongoingTotalPages = Math.ceil(filteredOngoingTrials.length / ITEMS_PER_PAGE);
  const defenseTotalPages = Math.ceil(filteredDefenseList.length / ITEMS_PER_PAGE);

  const handleEditMode = () => setIsEditMode(true);

  const handleCancelEdit = () => {
    setIsEditMode(false);
    if (userData) {
      setNickname(userData.nickname);
      setEmail(userData.email);
      setPhoneNumber(userData.phone_number || "");
    }
  };

  const handleUpdateInfo = async () => {
    try {
      await updateProfileMutation.mutateAsync({
        nickname,
        email,
        profileImageUrl: userData?.profileImageUrl ?? undefined,
      });
      alert("정보가 성공적으로 수정되었습니다.");
      setIsEditMode(false);
    } catch (err) {
      console.error("정보 수정 실패:", err);
      alert("정보 수정 중 오류가 발생했습니다.");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    // 파일 크기 체크 (예: 5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다.');
      return;
    }
    
    // 파일 타입 체크
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }
    
    try {
      await uploadImageMutation.mutateAsync(file);
      alert("프로필 사진이 성공적으로 변경되었습니다.");
      
      // 파일 입력 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      alert(`프로필 사진 업로드 중 오류가 발생했습니다: ${err.response?.data?.message || err.message}`);
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const PROFILE_BG_COLOR = "bg-[#4A7AD8]";

  if (!isAuthenticated) { 
    return (
      <div className="text-center py-20 min-h-screen bg-white">
        <h1 className="text-3xl font-bold text-main mb-4">로그인이 필요합니다.</h1>
        <p className="text-lg text-gray-600 mb-6">마이페이지는 회원만 접근 가능합니다.</p>
        <Button variant="primary" size="lg" onClick={() => window.location.href = "/login"}>
          로그인 페이지로 이동
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-center py-20 text-main font-bold">사용자 정보를 불러오는 중입니다...</div>;
  }

  if (isError) {
    console.error("Error fetching user profile:", error);
    return <div className="text-center py-20 text-main-red font-bold">오류 발생: {error?.message}</div>;
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-6xl mx-auto px-4 flex flex-col"> 
        <div className="w-full">
          <h2 className="text-[38px] font-bold text-main mb-4 pb-2">마이페이지</h2>
          <div className={`${PROFILE_BG_COLOR} px-8 pt-4 rounded-xl flex items-center mb-10`}>
            <div className="flex-grow">              
              <h2 className="text-white text-3xl font-extrabold mb-2">{nickname}님의 법정</h2>
              <p className="text-white text-lg">
                <span className="font-bold">{wins}</span>승 <span className="font-bold">{losses}</span>패
              </p>
            </div>
            <img src={judgeIllustrationUrl} alt="판사 아이콘" className="bottom-0 w-[201px] h-auto text-white " /> 
          </div>
        </div>

        <div className="flex w-full">
          <div className="w-1/4 pr-8 pt-8">
            <nav className="flex flex-col space-y-2">
              <Button 
                variant={selectedMenu === "profile" ? "bright_main" : "ghost"} 
                className="text-md transition duration-150 ease-in-out flex items-center gap-2" 
                onClick={() => setSelectedMenu("profile")}
              >
                <UserIcon className="w-5 h-5" />
                내 정보 조회/수정
              </Button>
              
              <Button 
                variant={selectedMenu === "exp" ? "bright_main" : "ghost"} 
                className="text-md transition duration-150 ease-in-out flex items-center gap-2" 
                onClick={() => setSelectedMenu("exp")}
              >
                <ExpIcon className="w-5 h-5" />
                경험치 및 칭호 조회
              </Button>
              
              <Button 
                variant={selectedMenu === "achievements" ? "bright_main" : "ghost"} 
                className="text-md transition duration-150 ease-in-out flex items-center gap-2" 
                onClick={() => setSelectedMenu("achievements")}
              >
                <MedalIcon className="w-5 h-5" />
                업적 조회하기
              </Button>
              
              <Button 
                variant={selectedMenu === "participate" ? "bright_main": "ghost"} 
                className="text-md transition duration-150 ease-in-out flex items-center gap-2" 
                onClick={() => setSelectedMenu("participate")}
              >
                <MypageHammerIcon className="w-5 h-5" />
                현재까지 참여한 재판
              </Button>
            </nav>
          </div>

          <div className="w-3/4 pl-8 pt-8">
            {selectedMenu === "profile" && (
              <div>
                <h3 className="text-2xl font-bold text-main mb-6 border-b pb-2">내 정보 조회/수정</h3>

                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center space-x-6">
                    {/* ProfileIcon 대신 실제 이미지 표시 */}
                    {userData?.profileImageUrl ? (
                      <img 
                        src={userData.profileImageUrl} 
                        alt="프로필 사진" 
                        className="w-24 h-24 rounded-full object-cover border-2 border-main"
                      />
                    ) : (
                      <ProfileIcon className="w-24 h-24 text-main bg-gray-100 rounded-full p-1" title="프로필 사진" />
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    {uploadImageMutation.isPending && <p className="text-main text-sm">이미지 업로드 중...</p>}
                  </div>

                  {isEditMode && (
                    <div>
                      <Button
                        variant="bright_main"
                        size="md"
                        className="px-4 py-2"
                        onClick={triggerFileInput}
                        disabled={uploadImageMutation.isPending}
                      >
                        프로필 사진 수정
                      </Button>
                    </div>
                  )}
                </div>

                <div className={`${isEditMode ? "bg-main-bright p-3 rounded-md" : "border-b-2 border-main focus:border-main outline-none"} mb-6`}>
                  <label htmlFor="nickname" className="block text-main text-lg font-medium mb-2">닉네임</label>
                  <input
                    type="text"
                    id="nickname"
                    className="w-full  pb-2 text-lg text-main bg-transparent"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    disabled={!isEditMode}
                  />
                </div>

                <div className={`${isEditMode ? "" : "border-b-2 border-main focus:border-main outline-none"} mb-6`}>
                  <label htmlFor="email" className="block text-main text-lg font-medium mb-2">이메일 주소</label>
                  <textarea
                    id="email"
                    rows={1}
                    className="w-full pb-2 text-lg text-main bg-transparent resize-none rounded-md"
                    value={email}
                    readOnly
                  />
                </div>

                {/*
                <div className={`${isEditMode ? "bg-main-bright p-3 rounded-md" : "border-b-2 border-main focus:border-main outline-none"} mb-6`}>
                  <label htmlFor="phone" className="block text-main text-lg font-medium mb-2">전화번호</label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full pb-2 text-lg text-gray-800 bg-transparent"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={!isEditMode}
                  />
                </div>
                */}

                <div className="flex justify-end gap-4 mt-10">
                  {!isEditMode ? (
                    <Button variant="bright_main" size="lg" className="px-8 py-3 rounded-md" onClick={handleEditMode}>정보 수정하기</Button>
                  ) : (
                    <>
                      <Button variant="ghost" size="lg" className="px-8 py-3 rounded-md  text-main" onClick={handleCancelEdit} disabled={updateProfileMutation.isPending || uploadImageMutation.isPending}>취소</Button>
                      <Button variant="bright_main" size="md" className="px-8 py-3 rounded-md" onClick={handleUpdateInfo} disabled={updateProfileMutation.isPending || uploadImageMutation.isPending}>
                        {updateProfileMutation.isPending ? "저장 중..." : "정보 수정 완료"}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}

            {selectedMenu === "exp" && (
              <div className="pt-4">
                <h3 className="text-2xl font-bold text-main ">현재 칭호</h3>
                <span className="text-main mb-6">{currentRank}</span>
                <p className="text-xl font-bold text-main mb-4 pt-8">현재 경험치: <span className="text-main">{currentExp}</span></p>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                  <div className="bg-main h-4 rounded-full transition-all duration-500" style={{ width: `${Math.min((currentExp / 2000) * 100, 100)}%` }} />
                </div>
              </div>
            )}
            
            {selectedMenu === "achievements" && (
              <div className="pt-4">
                <h3 className="text-2xl font-bold text-main mb-6 border-b pb-2">업적 조회하기</h3>
                {achievementsData?.result && achievementsData.result.length > 0 ? (
                  <div className="space-y-4">
                    {achievementsData.result.map(achievement => (
                      <div key={achievement.achievementId} className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-bold text-main mb-2">{achievement.achievementName}</h4>
                        <p className="text-gray-600 text-sm">{achievement.achievementDescription}</p>
                        <p className="text-gray-500 text-xs mt-2">{new Date(achievement.achievementTime).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 bg-gray-50 rounded-lg"><p className="text-main-medium">획득한 업적이 없습니다.</p></div>
                )}
              </div>
            )}

            {selectedMenu === "participate" && (
              <div className="pt-4">
                <h3 className="text-2xl font-bold text-main mb-6">참여한 재판 목록</h3>
                
                {/* 탭 네비게이션 + 정렬 */}
                <div className="flex justify-between items-center mb-6 border-b border-gray-300">
                  <div className="flex gap-2">
                    <button
                      className={`px-4 py-2 font-semibold transition-colors ${
                        participateTab === "전체"
                          ? "text-main border-b-2 border-main"
                          : "text-gray-500 hover:text-main"
                      }`}
                      onClick={() => setParticipateTab("전체")}
                    >
                      전체
                    </button>
                    <button
                      className={`px-4 py-2 font-semibold transition-colors ${
                        participateTab === "진행중"
                          ? "text-main border-b-2 border-main"
                          : "text-gray-500 hover:text-main"
                      }`}
                      onClick={() => setParticipateTab("진행중")}
                    >
                      내가 진행중인 재판
                    </button>
                    <button
                      className={`px-4 py-2 font-semibold transition-colors ${
                        participateTab === "변호전적"
                          ? "text-main border-b-2 border-main"
                          : "text-gray-500 hover:text-main"
                      }`}
                      onClick={() => setParticipateTab("변호전적")}
                    >
                      나의 변호 전적
                    </button>
                  </div>

                  {/* 정렬 드롭다운 - 모든 탭에 표시 */}
                  {participateTab === "전체" && (
                    <select 
                      value={sortType} 
                      onChange={(e) => setSortType(e.target.value as CaseResult | '정렬')} 
                      className="p-2 rounded-md bg-main-bright text-main-medium cursor-pointer mb-2"
                    >
                      <option value="정렬">정렬</option>
                      <option value="WIN">승리</option>
                      <option value="LOSE">패배</option>
                      <option value="PENDING">진행중</option>
                    </select>
                  )}
                  
                  {participateTab === "진행중" && (
                    <select 
                      value={sortType} 
                      onChange={(e) => setSortType(e.target.value as CaseResult | '정렬')} 
                      className="p-2 rounded-md bg-main-bright text-main-medium cursor-pointer mb-2"
                    >
                      <option value="정렬">정렬</option>
                      <option value="WIN">승리</option>
                      <option value="LOSE">패배</option>
                      <option value="PENDING">진행중</option>
                    </select>
                  )}

                  {participateTab === "변호전적" && (
                    <select 
                      value={defenseSortType} 
                      onChange={(e) => setDefenseSortType(e.target.value as '정렬' | 'WIN' | 'LOSE' | 'PENDING' | 'LIKE')} 
                      className="p-2 rounded-md bg-main-bright text-main-medium cursor-pointer mb-2"
                    >
                      <option value="정렬">정렬</option>
                      <option value="LIKE">좋아요순</option>
                      <option value="WIN">승리한 재판</option>
                      <option value="LOSE">패배한 재판</option>
                      <option value="PENDING">진행중인 재판</option>
                    </select>
                  )}
                </div>

                {/* 전체 탭 */}
                {participateTab === "전체" && (
                  <>
                    <div className="mb-4">
                      <span className="text-lg text-main">({allItems.length}개 항목)</span>
                    </div>
                    <div className="space-y-4">
                      {paginatedAllItems.length > 0 ? (
                        <>
                          {paginatedAllItems.map((item, idx) => (
                            <div key={`all-${idx}`}>
                              <p className="text-sm text-main mb-2">
                                {item.type === 'ongoing' 
                                  ? `내가 진행중인 재판 - ${(item as any).mode || '솔로모드'}`
                                  : '나의 변호 전적'
                                }
                              </p>
                              {item.type === 'ongoing' ? (
                                <TrialListItem trial={item as any} />
                              ) : (
                                <DefenseListItem defense={item as any} />
                              )}
                            </div>
                          ))}
                          {allTotalPages > 1 && (
                            <Pagination
                              currentPage={allPage}
                              totalPages={allTotalPages}
                              onPageChange={setAllPage}
                            />
                          )}
                        </>
                      ) : (
                        <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg">참여한 내역이 없습니다.</div>
                      )}
                    </div>
                  </>
                )}

                {/* 진행중 탭 */}
                {participateTab === "진행중" && (
                  <>
                    <div className="mb-4">
                      <span className="text-lg text-main">({filteredOngoingTrials.length}개의 재판)</span>
                    </div>
                    <div className="space-y-4">
                      {paginatedOngoingTrials.length > 0 ? (
                        <>
                          {paginatedOngoingTrials.map((trial, idx) => (
                            <div key={`ongoing-${idx}`}>
                              <p className="text-sm text-main mb-2">
                                내가 진행중인 재판 - {trial.mode || '솔로모드'}
                              </p>
                              <TrialListItem trial={trial} />
                            </div>
                          ))}
                          {ongoingTotalPages > 1 && (
                            <Pagination
                              currentPage={ongoingPage}
                              totalPages={ongoingTotalPages}
                              onPageChange={setOngoingPage}
                            />
                          )}
                        </>
                      ) : (
                        <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg">진행중인 재판이 없습니다.</div>
                      )}
                    </div>
                  </>
                )}

                {/* 변호전적 탭 */}
                {participateTab === "변호전적" && (
                  <>
                    <div className="mb-4">
                      <span className="text-lg text-main">({filteredDefenseList.length}개의 변론/반론)</span>
                    </div>
                    <div className="space-y-4">
                      {paginatedDefenseList.length > 0 ? (
                        <>
                          {paginatedDefenseList.map((defense, idx) => (
                            <div key={`defense-${idx}`}>
                              <p className="text-sm text-main mb-2">나의 변호 전적</p>
                              <DefenseListItem defense={defense} />
                            </div>
                          ))}
                          {defenseTotalPages > 1 && (
                            <Pagination
                              currentPage={defensePage}
                              totalPages={defenseTotalPages}
                              onPageChange={setDefensePage}
                            />
                          )}
                        </>
                      ) : (
                        <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg">작성한 변론이 없습니다.</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
