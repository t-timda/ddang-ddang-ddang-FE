import React, { useState, useEffect, useRef, useMemo } from "react";
import Button from "@/components/common/Button"; 
import TrialListItem, { TrialData, CaseResult } from "@/components/mypage/TrialListItem"; 
import judgeIllustrationUrl from "@/assets/svgs/FirstJudge.svg?url"; 
import ProfileIcon from "@/assets/svgs/profileIcon.svg?react";
import { useUserProfileQuery, useUserRecordQuery, useUserAchievementsQuery, useUserRankQuery, useUserCasesQuery, useUpdateUserProfileMutation, useUploadProfileImageMutation } from "@/hooks/api/useUserQuery";
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

  const wins = recordData?.result?.winCnt ?? 0;
  const losses = recordData?.result?.loseCnt ?? 0;

  const currentRank = rankData?.result?.rank ?? "로딩 중...";
  const currentExp = rankData?.result?.exp ?? 0;

  const trialListData: TrialData[] = useMemo(() => {
    return casesData?.result?.map(caseItem => ({
      id: caseItem.caseId,
      title: caseItem.title,
      mySide: caseItem.mainArguments[0] || "",
      status: caseItem.status, // "DONE" | "SECOND" | "PENDING"
      caseResult: caseItem.caseResult, // "WIN" | "LOSE" | "PENDING"
    })) ?? [];
  }, [casesData]);

  const filteredTrials = useMemo(() => {
    const list = [...trialListData];
    if (sortType === '정렬') return list.sort((a, b) => b.id - a.id);
    return list.filter(trial => trial.caseResult === sortType);
  }, [sortType, trialListData]);

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
    try {
      await uploadImageMutation.mutateAsync(file);
      alert("프로필 사진이 성공적으로 변경되었습니다.");
    } catch (err) {
      console.error("프로필 사진 업로드 실패:", err);
      alert("프로필 사진 업로드 중 오류가 발생했습니다.");
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
              <Button variant={selectedMenu === "profile" ? "bright_main" : "ghost"} className="text-md transition duration-150 ease-in-out" onClick={() => setSelectedMenu("profile")}>내 정보 조회/수정</Button>
              <Button variant={selectedMenu === "exp" ? "bright_main" : "ghost"} className="text-md transition duration-150 ease-in-out" onClick={() => setSelectedMenu("exp")}>경험치 및 칭호 조회</Button>
              <Button variant={selectedMenu === "achievements" ? "bright_main" : "ghost"} className="text-md transition duration-150 ease-in-out" onClick={() => setSelectedMenu("achievements")}>업적 조회하기</Button>
              <Button variant={selectedMenu === "records" ? "bright_main" : "ghost"} className="text-md transition duration-150 ease-in-out" onClick={() => setSelectedMenu("records")}>전적 조회하기</Button>
              <Button variant={selectedMenu === "participate" ? "bright_main": "ghost"} className="text-md transition duration-150 ease-in-out" onClick={() => setSelectedMenu("participate")}>현재까지 참여한 재판</Button>
            </nav>
          </div>

          <div className="w-3/4 pl-8 pt-8">
            {selectedMenu === "profile" && (
              <div>
                <h3 className="text-2xl font-bold text-main mb-6 border-b pb-2">내 정보 조회/수정</h3>

                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center space-x-6">
                    <ProfileIcon className="w-24 h-24 text-main bg-gray-100 rounded-full p-1" title="프로필 사진" />
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

                {/* 닉네임 (편집 가능 시 bg 적용) */}
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

                {/* 이메일 (항상 읽기 전용, textarea 유지) */}
                <div className={`${isEditMode ? "" : "border-b-2 border-main focus:border-main outline-none"} mb-6`}>
                  <label htmlFor="email" className="block text-main text-lg font-medium mb-2">이메일 주소</label>
                  <textarea
                    id="email"
                    rows={2}
                    className="w-full pb-2 text-lg text-main bg-transparent resize-none rounded-md"
                    value={email}
                    readOnly
                  />
                </div>

                {/* 전화번호 (편집 가능 시 bg 적용) */}
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

            {selectedMenu === "records" && (
              <div className="pt-4">
                <h3 className="text-2xl font-bold text-main mb-6 border-b pb-2">전적 조회하기</h3>
                <div className="p-6 bg-gray-50 rounded-lg">
                  <p className="text-main-medium text-lg font-bold">총 {wins}승 {losses}패</p>
                  <p className="text-main-medium mt-2">승률: {wins + losses > 0 ? ((wins / (wins + losses)) * 100).toFixed(1) : 0}%</p>
                </div>
              </div>
            )}

            {selectedMenu === "participate" && (
              <div className="pt-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">참여한 재판 목록 <span className="text-lg text-gray-500 font-normal">({trialListData.length}개의 재판)</span></h3>
                  <select value={sortType} onChange={(e) => setSortType(e.target.value as CaseResult | '정렬')} className="p-2 rounded-md bg-main-bright text-main-medium cursor-pointer appearance">
                    <option value="정렬">전체</option>
                    <option value="WIN">승리</option>
                    <option value="LOSE">패배</option>
                    <option value="PENDING">진행중</option>
                  </select>
                </div>

                <div className="space-y-2">
                  {filteredTrials.length > 0 ? filteredTrials.map(trial => <TrialListItem key={trial.id} trial={trial} />) : <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg">필터링된 재판이 없습니다.</div>}
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
