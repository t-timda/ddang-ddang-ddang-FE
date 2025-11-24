import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Button from "@/components/common/Button";
import UserIcon from "@/assets/svgs/userIcon.svg?react";
import ExpIcon from "@/assets/svgs/expIcon.svg?react";
import MedalIcon from "@/assets/svgs/medalIcon.svg?react";
import MypageHammerIcon from "@/assets/svgs/mypageHammerIcon.svg?react";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  useUpdateUserProfileMutation,
  useUploadProfileImageMutation,
} from "@/hooks/api/useUserQuery";
import { useMyPageData } from "@/hooks/mypage/useMyPageData";
import { useMyPageFilters } from "@/hooks/mypage/useMyPageFilters";
import { ProfileTab } from "@/components/mypage/tabs/ProfileTab";
import { ExpTab } from "@/components/mypage/tabs/ExpTab";
import { AchievementsTab } from "@/components/mypage/tabs/AchievementsTab";
import { ParticipateTab } from "@/components/mypage/tabs/ParticipateTab";
import { CaseResult } from "@/components/mypage/TrialListItem";
import { getRankProfileImage } from "@/utils/rankImageMapper";

const MyPage = () => {
  const authStore = useAuthStore();
  const isAuthenticated = !!authStore.accessToken;
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    userData,
    isLoading,
    isError,
    error,
    wins,
    losses,
    currentRank,
    currentExp,
    achievementsData,
    ongoingTrialsWithType,
    defenseListWithResult,
    allItems,
    isLargeScreen,
  } = useMyPageData(isAuthenticated);

  const updateProfileMutation = useUpdateUserProfileMutation();
  const uploadImageMutation = useUploadProfileImageMutation();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialTab = searchParams.get("tab") || "profile";
  const initialSubTab = searchParams.get("subtab") as
    | "전체"
    | "진행중"
    | "변호전적"
    | null;

  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(initialTab);
  const [sortType, setSortType] = useState<CaseResult | "정렬">("정렬");
  const [defenseSortType, setDefenseSortType] = useState<
    "정렬" | "WIN" | "LOSE" | "PENDING" | "LIKE"
  >("정렬");
  const [participateTab, setParticipateTab] = useState<
    "전체" | "진행중" | "변호전적"
  >(initialSubTab || "전체");

  const [allPage, setAllPage] = useState(1);
  const [ongoingPage, setOngoingPage] = useState(1);
  const [defensePage, setDefensePage] = useState(1);
  const [achievementPage, setAchievementPage] = useState(1);

  const ITEMS_PER_PAGE = 10;
  const ACHIEVEMENTS_PER_PAGE = 6;

  const rankProfileImage = useMemo(() => {
    return getRankProfileImage(currentRank);
  }, [currentRank]);

  useEffect(() => {
    if (userData) {
      setNickname(userData.nickname);
      setEmail(userData.email);
    }
  }, [userData]);

  useEffect(() => {
    const tab = searchParams.get("tab");
    const subtab = searchParams.get("subtab");

    if (tab) {
      setSelectedMenu(tab);
    }

    if (
      subtab &&
      (subtab === "전체" || subtab === "진행중" || subtab === "변호전적")
    ) {
      setParticipateTab(subtab);
    }
  }, [searchParams]);

  const { filteredAllItems, filteredOngoingTrials, filteredDefenseList } =
    useMyPageFilters(
      allItems,
      ongoingTrialsWithType,
      defenseListWithResult,
      sortType,
      defenseSortType
    );

  const paginatedAchievements = useMemo(() => {
    const achievements = achievementsData?.result ?? [];
    const startIndex = (achievementPage - 1) * ACHIEVEMENTS_PER_PAGE;
    const endIndex = startIndex + ACHIEVEMENTS_PER_PAGE;
    return achievements.slice(startIndex, endIndex);
  }, [achievementsData, achievementPage]);

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

  const achievementTotalPages = Math.ceil(
    (achievementsData?.result?.length ?? 0) / ACHIEVEMENTS_PER_PAGE
  );
  const allTotalPages = Math.ceil(filteredAllItems.length / ITEMS_PER_PAGE);
  const ongoingTotalPages = Math.ceil(
    filteredOngoingTrials.length / ITEMS_PER_PAGE
  );
  const defenseTotalPages = Math.ceil(
    filteredDefenseList.length / ITEMS_PER_PAGE
  );

  const handleEditMode = () => setIsEditMode(true);

  const handleCancelEdit = () => {
    setIsEditMode(false);
    if (userData) {
      setNickname(userData.nickname);
      setEmail(userData.email);
    }
  };

  // 🔧 여기만 수정
  const handleUpdateInfo = async () => {
    if (!nickname.trim()) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    try {
      await updateProfileMutation.mutateAsync({
        // 닉네임만 변경
        nickname: nickname.trim(),
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

    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하여야 합니다.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }

    try {
      await uploadImageMutation.mutateAsync(file);
      alert("프로필 사진이 성공적으로 변경되었습니다.");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err: any) {
      alert(
        `프로필 사진 업로드 중 오류가 발생했습니다: ${
          err.response?.data?.message || err.message
        }`
      );
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12 md:py-20">
        <h1 className="text-2xl md:text-3xl font-bold text-main mb-4">
          로그인이 필요합니다.
        </h1>
        <p className="text-base md:text-lg text-gray-600 mb-6">
          마이페이지는 회원만 접근 가능합니다.
        </p>
        <Button
          variant="primary"
          size="lg"
          onClick={() => (window.location.href = "/login")}
        >
          로그인 페이지로 이동
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-12 md:py-20 text-main font-bold px-4">
        사용자 정보를 불러오는 중입니다...
      </div>
    );
  }

  if (isError) {
    console.error("Error fetching user profile:", error);
    return (
      <div className="text-center py-12 md:py-20 text-main-red font-bold px-4">
        오류 발생: {(error as any)?.message}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-6 md:py-12">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-4 flex flex-col">
        <div className="w-full">
          <h2 className="text-2xl md:text-[38px] font-bold text-main mb-3 md:mb-4 pb-2">
            마이페이지
          </h2>
          <div className="bg-[#4A7AD8] px-4 md:px-8 pt-3 md:pt-4 rounded-xl flex items-center justify-between mb-6 md:mb-10">
            <div className="flex-grow">
              <h2 className="text-white text-xl md:text-2xl lg:text-3xl font-extrabold mb-1 md:mb-2">
                {nickname}님의 법정
              </h2>
              <p className="text-white text-sm md:text-base lg:text-lg">
                <span className="font-bold">{wins}</span>승{" "}
                <span className="font-bold">{losses}</span>패
              </p>
            </div>
            <div className="w-[120px] h-[120px] md:w-[160px] md:h-[160px] lg:w-[201px] lg:h-[201px] overflow-hidden flex items-center justify-center flex-shrink-0">
              <img
                src={rankProfileImage}
                alt={`${currentRank} 아이콘`}
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row w-full gap-6 lg:gap-0">
          <div className="w-full lg:w-1/4 lg:pr-8 lg:pt-8">
            <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible space-x-2 lg:space-x-0 lg:space-y-2 pb-2 lg:pb-0">
              <Button
                variant={selectedMenu === "profile" ? "bright_main" : "ghost"}
                className="text-sm md:text-md transition duration-150 ease-in-out flex items-center gap-2 whitespace-nowrap flex-shrink-0"
                onClick={() => setSelectedMenu("profile")}
              >
                <UserIcon className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline">내 정보 조회/수정</span>
                <span className="sm:hidden">정보</span>
              </Button>

              <Button
                variant={selectedMenu === "exp" ? "bright_main" : "ghost"}
                className="text-sm md:text-md transition duration-150 ease-in-out flex items-center gap-2 whitespace-nowrap flex-shrink-0"
                onClick={() => setSelectedMenu("exp")}
              >
                <ExpIcon className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline">경험치 및 칭호 조회</span>
                <span className="sm:hidden">칭호</span>
              </Button>

              <Button
                variant={
                  selectedMenu === "achievements" ? "bright_main" : "ghost"
                }
                className="text-sm md:text-md transition duration-150 ease-in-out flex items-center gap-2 whitespace-nowrap flex-shrink-0"
                onClick={() => setSelectedMenu("achievements")}
              >
                <MedalIcon className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline">업적 조회하기</span>
                <span className="sm:hidden">업적</span>
              </Button>

              <Button
                variant={
                  selectedMenu === "participate" ? "bright_main" : "ghost"
                }
                className="text-sm md:text-md transition duration-150 ease-in-out flex items-center gap-2 whitespace-nowrap flex-shrink-0"
                onClick={() => setSelectedMenu("participate")}
              >
                <MypageHammerIcon className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline">현재까지 참여한 재판</span>
                <span className="sm:hidden">재판</span>
              </Button>
            </nav>
          </div>

          <div className="w-full lg:w-3/4 lg:pl-8 lg:pt-8">
            {selectedMenu === "profile" && (
              <ProfileTab
                userData={userData}
                nickname={nickname}
                setNickname={setNickname}
                email={email}
                setEmail={setEmail}
                isEditMode={isEditMode}
                handleEditMode={handleEditMode}
                handleCancelEdit={handleCancelEdit}
                handleUpdateInfo={handleUpdateInfo}
                handleImageUpload={handleImageUpload}
                triggerFileInput={triggerFileInput}
                updateProfileMutation={updateProfileMutation}
                uploadImageMutation={uploadImageMutation}
                fileInputRef={fileInputRef}
              />
            )}

            {selectedMenu === "exp" && (
              <ExpTab
                currentRank={currentRank}
                currentExp={currentExp}
                nickname={nickname}
              />
            )}

            {selectedMenu === "achievements" && (
              <AchievementsTab
                achievementsData={achievementsData}
                paginatedAchievements={paginatedAchievements}
                achievementPage={achievementPage}
                achievementTotalPages={achievementTotalPages}
                setAchievementPage={setAchievementPage}
              />
            )}

            {selectedMenu === "participate" && (
              <ParticipateTab
                participateTab={participateTab}
                setParticipateTab={setParticipateTab}
                sortType={sortType}
                setSortType={setSortType}
                defenseSortType={defenseSortType}
                setDefenseSortType={setDefenseSortType}
                allItems={allItems}
                paginatedAllItems={paginatedAllItems}
                allPage={allPage}
                allTotalPages={allTotalPages}
                setAllPage={setAllPage}
                filteredOngoingTrials={filteredOngoingTrials}
                paginatedOngoingTrials={paginatedOngoingTrials}
                ongoingPage={ongoingPage}
                ongoingTotalPages={ongoingTotalPages}
                setOngoingPage={setOngoingPage}
                filteredDefenseList={filteredDefenseList}
                paginatedDefenseList={paginatedDefenseList}
                defensePage={defensePage}
                defenseTotalPages={defenseTotalPages}
                setDefensePage={setDefensePage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
