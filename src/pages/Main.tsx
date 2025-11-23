import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import Button from "@/components/common/Button";
import HotDebateCard from "@/components/common/DebateCard";
import Hammer from "@/assets/svgs/hammer.svg?react";
import Left from "@/assets/svgs/Left.svg?react";
import Right from "@/assets/svgs/Right.svg?react";
import firstJudgeIllustrationUrl from "@/assets/svgs/FirstJudge.svg?url";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/constants";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  useHotCasesQuery,
  useMyOngoingCasesQuery,
  useMyDefensesQuery,
} from "@/hooks/home/useHome";
import { useUserProfileQuery } from "@/hooks/api/useUserQuery";
import { usePostLoginMutation } from "@/hooks/auth/useAuthMutations";
import CircleArrowIcon from "@/assets/icons/CircleArrow";


// HOT 재판 더미 데이터 (API 실패 시 사용)
const hotDebatesFallback = [
  { id: 1, title: "짜장면 VS 짬뽕", participateCnt: 120 },
  { id: 2, title: "민트초코 VS 반민트초코", participateCnt: 85 },
  { id: 3, title: "부먹 VS 찍먹", participateCnt: 95 },
  { id: 4, title: "바다 VS 산", participateCnt: 110 },
  { id: 5, title: "수도권 VS 지방 이사 논쟁", participateCnt: 77 },
  { id: 6, title: "커피 VS 탄산음료", participateCnt: 99 },
  { id: 7, title: "라면 VS 떡볶이", participateCnt: 54 },
];

// 캐러셀 배치용 상수
const CARD_WIDTH = 340;
const CARD_GAP = 16;
const AUTO_SLIDE_INTERVAL = 4000;
const CAROUSEL_TRANSITION_MS = 500;
const CAROUSEL_BREAKPOINTS = [
  { minWidth: 1280, visibleCount: 4 },
  { minWidth: 1024, visibleCount: 3 },
  { minWidth: 768, visibleCount: 2 },
  { minWidth: 0, visibleCount: 1 },
];

const DEFAULT_VISIBLE_COUNT =
  CAROUSEL_BREAKPOINTS[CAROUSEL_BREAKPOINTS.length - 1].visibleCount;

const getVisibleCountForWidth = (width: number | null | undefined) => {
  if (!width && width !== 0) return DEFAULT_VISIBLE_COUNT;

  return (
    CAROUSEL_BREAKPOINTS.find((bp) => width >= bp.minWidth)?.visibleCount ??
    DEFAULT_VISIBLE_COUNT
  );
};

const MainPage = () => {
  // 캐러셀 시작 인덱스
  const [startIndex, setStartIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(CARD_WIDTH);
  const [visibleCount, setVisibleCount] = useState(() =>
    typeof window === "undefined"
      ? getVisibleCountForWidth(null)
      : getVisibleCountForWidth(window.innerWidth)
  );
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  // 로그인 모달
  const [showLoginModal, setShowLoginModal] = useState(false);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      const nextVisibleCount = getVisibleCountForWidth(window.innerWidth);
      setVisibleCount((prev) =>
        prev === nextVisibleCount ? prev : nextVisibleCount
      );
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 캐러셀 이동 값
  const translateSingleValue = -(startIndex * (cardWidth + CARD_GAP));

  const navigate = useNavigate();
  const accessToken = useAuthStore((s) => s.accessToken);
  const isLogin = useAuthStore((s) => s.isLogin);
  const userRank = useAuthStore((s) => s.rank);

  // 메인 페이지 API
  const hotQ = useHotCasesQuery();
  useMyOngoingCasesQuery(isLogin);
  useMyDefensesQuery(isLogin);
  const {
    data: userProfile,
    isLoading: isUserProfileLoading,
    isError: isUserProfileError,
    error: userProfileError,
  } = useUserProfileQuery({ enabled: isLogin });

  const {
    mutate: mainLoginMutate,
    isPending: isMainLoginPending,
  } = usePostLoginMutation({
    onSuccess: () => {
      setLoginError(null);
      setLoginPassword("");
      setLoginEmail("");
    },
    onError: (error) => {
      setLoginError(error.message || "로그인에 실패했습니다.");
    },
  });

  const handleInlineLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim() || isMainLoginPending)
      return;
    setLoginError(null);
    mainLoginMutate({ email: loginEmail, password: loginPassword });
  };

  const isInlineLoginDisabled =
    !loginEmail.trim() || !loginPassword.trim() || isMainLoginPending;

  // 날짜 포맷 함수
  const formatUpdateTime = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = String(hours % 12 || 12).padStart(2, '0');
    
    return `${year}.${month}.${day} ${period} ${displayHours}:${minutes}`;
  };

  // HOT 재판 리스트 (API → 카드용 데이터)
  const hotList =
  hotQ.data?.data?.result?.map((c) => ({
    id: c.caseId,
    title:
      c.mainArguments && c.mainArguments.length >= 2
        ? `${c.mainArguments[0]} VS ${c.mainArguments[1]}`
        : c.title,
    originalTitle: c.title,
    mainArguments: c.mainArguments,
    participateCnt: c.participateCnt ?? 0,
  })) ?? [];

  const lastUpdated = hotQ.data?.lastUpdated 
    ? formatUpdateTime(hotQ.data.lastUpdated)
    : '';

  const totalSlides = hotList.length;
  const shouldLoop = totalSlides > visibleCount;
  const carouselItems = useMemo(
    () =>
      shouldLoop ? [...hotList, ...hotList.slice(0, visibleCount)] : hotList,
    [hotList, shouldLoop, visibleCount]
  );
  const finiteMaxIndex = useMemo(
    () => Math.max(totalSlides - visibleCount, 0),
    [totalSlides, visibleCount]
  );

  useEffect(() => {
    setStartIndex((prev) => {
      if (shouldLoop) {
        if (totalSlides === 0) return 0;
        return prev % totalSlides;
      }
      return Math.min(prev, finiteMaxIndex);
    });
  }, [shouldLoop, finiteMaxIndex, totalSlides]);

  useEffect(() => {
    const updateCardWidth = () => {
      const viewport = viewportRef.current;
      if (!viewport || visibleCount <= 0) return;
      const width =
        (viewport.clientWidth -
          CARD_GAP * Math.max(visibleCount - 1, 0)) /
        visibleCount;
      setCardWidth(width > 0 ? width : CARD_WIDTH);
    };

    updateCardWidth();

    if (typeof ResizeObserver !== "undefined" && viewportRef.current) {
      const observer = new ResizeObserver(() => updateCardWidth());
      observer.observe(viewportRef.current);
      return () => observer.disconnect();
    }

    window.addEventListener("resize", updateCardWidth);
    return () => window.removeEventListener("resize", updateCardWidth);
  }, [visibleCount]);

  // 이전 화살표
  const handlePrevSingle = useCallback(() => {
    console.log("이전 슬라이드 클릭");
    if (shouldLoop) {
      if (startIndex === 0) {
        if (totalSlides === 0) return;
        setIsTransitionEnabled(false);
        requestAnimationFrame(() => {
          setStartIndex(totalSlides - 1);
          requestAnimationFrame(() => setIsTransitionEnabled(true));
        });
        return;
      }
      setStartIndex((prevIndex) => Math.max(prevIndex - 1, 0));
      return;
    }

    setStartIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  }, [shouldLoop, startIndex, totalSlides]);

  // 다음 화살표
  const handleNextSingle = useCallback(() => {
    if (shouldLoop) {
      setStartIndex((prevIndex) => prevIndex + 1);
    } else {
      setStartIndex((prevIndex) => Math.min(prevIndex + 1, finiteMaxIndex));
    }
    console.log("다음 슬라이드 클릭");
  }, [shouldLoop, finiteMaxIndex]);

  useEffect(() => {
    if (!shouldLoop) return;
    const timer = window.setInterval(() => {
      setStartIndex((prev) => prev + 1);
    }, AUTO_SLIDE_INTERVAL);

    return () => window.clearInterval(timer);
  }, [shouldLoop, totalSlides, visibleCount]);

  useEffect(() => {
    if (!shouldLoop) return;
    if (totalSlides === 0) return;
    if (startIndex < totalSlides) return;

    const timeoutId = window.setTimeout(() => {
      setIsTransitionEnabled(false);
      requestAnimationFrame(() => {
        setStartIndex(0);
        requestAnimationFrame(() => setIsTransitionEnabled(true));
      });
    }, CAROUSEL_TRANSITION_MS);

    return () => window.clearTimeout(timeoutId);
  }, [shouldLoop, startIndex, totalSlides]);

  return (
    <div className="bg-white min-h-screen w-full flex items-center flex-col">
      {/* 상단 영역 */}
      <section className="flex flex-col md:flex-row items-center w-full max-w-7xl p-4 justify-center gap-[30px] my-10">
        {/* 왼쪽: 슬로건 + 로그인 박스 (UI 데코) */}
        <div className="flex flex-col gap-[32px] w-full md:w-[380px]">
          <h1 className="text-main font-bold text-[36px] leading-[150%] text-center md:text-left">
            일상의 고민, <br />
            AI와 함께 재판해보세요
          </h1>

          <div className="w-full">
            {isLogin ? (
              <div className="bg-main px-[35px] py-[44px] rounded-2xl w-full md:w-[380px] h-[369px] flex">
                <div className="flex w-full h-full flex-col justify-between text-white">
                  <div className="h-full">
                    {isUserProfileLoading && (
                      <p className="mt-2 text-xl font-bold">
                        사용자 정보를 불러오는 중...
                      </p>
                    )}
                    {isUserProfileError && (
                      <p className="mt-2 rounded-lg bg-white/20 px-4 py-3 text-sm font-semibold text-main-red">
                        {userProfileError?.message ||
                          "사용자 정보를 가져오지 못했습니다."}
                      </p>
                    )}
                    {!isUserProfileLoading &&
                      !isUserProfileError &&
                      userProfile && (
                        <div className="h-full flex flex-col justify-between">
                          <div className="flex flex-col gap-4">
                            <span className="text-sm px-5 py-1 bg-main-medium rounded-2xl w-fit">
                              {userRank ?? userProfile.current_grade ?? "등급 정보 없음"}
                            </span>
                            <p className="text-2xl font-bold">
                              {userProfile.nickname} 님 환영합니다
                            </p>
                          </div>
                          <Button
                            variant="white"
                            className="w-full rounded-xl bg-white/90 py-3 text-main hover:bg-white"
                            onClick={() => navigate(PATHS.USER_ONGOING_TRIALS)}
                          >
                            <div className="px-1 py-1 w-full flex justify-between items-center">
                              <span className="text-base font-bold text-main">
                                내가 진행중인 재판
                              </span>
                              <CircleArrowIcon className="w-9" />
                            </div>
                          </Button>
                          <Button
                            variant="white"
                            className="w-full rounded-xl bg-white/90 py-3 text-main hover:bg-white"
                            onClick={() => navigate(`${PATHS.MY_PAGE}?tab=participate&subtab=변호전적`)}
                          >
                            <div className="px-1 py-1 w-full flex justify-between items-center">
                              <span className="text-base font-bold text-main">
                                나의 변호 전적
                              </span>
                              <CircleArrowIcon className="w-9" />
                            </div>
                          </Button>
                        </div>
                      )}

                    {!isUserProfileLoading &&
                      !isUserProfileError &&
                      !userProfile && (
                        <p className="mt-2 text-sm">
                          사용자 정보를 찾을 수 없습니다.
                        </p>
                      )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-main px-[35px] py-[44px] rounded-2xl w-full md:w-[380px] min-h-[369px]">
                <form
                  className="flex flex-col gap-6"
                  onSubmit={handleInlineLoginSubmit}
                >
                  <div className="flex gap-2 items-center mb-2">
                    <label className="text-[20px] text-white">로그인</label>
                    <Hammer />
                  </div>

                  <div className="w-full text-left">
                    <input
                      type="text"
                      id="main-login-email"
                      placeholder="ID"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="bg-main-bright text-main font-bold h-15 w-full px-3 py-2 mt-1 rounded-md focus:outline-none disabled:bg-gray-100"
                      autoComplete="email"
                    />
                  </div>

                  <div className="w-full mt-0 text-left">
                    <input
                      type="password"
                      id="main-login-password"
                      placeholder="Password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="bg-main-bright text-main font-bold h-15 w-full px-3 py-2 mt-1 rounded-md focus:outline-none disabled:bg-gray-100"
                      autoComplete="current-password"
                    />
                  </div>

                  {loginError && (
                    <p className="text-sm text-main-red" role="alert">
                      {loginError}
                    </p>
                  )}

                  <div className="flex justify-between items-center gap-4">
                    <Button
                      variant="ghost"
                      className="text-white hover:underline"
                      type="button"
                      onClick={() => navigate(PATHS.SIGNUP)}
                    >
                      회원가입
                    </Button>
                    <Button
                      variant="primary"
                      className="px-10 py-2 rounded-md"
                      type="submit"
                      disabled={isInlineLoginDisabled}
                      isLoading={isMainLoginPending}
                    >
                      로그인
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* 오른쪽: 첫 재판 시작 패널 */}
        <div className="flex-1 flex flex-col gap-3 justify-between bg-[#6596DA] rounded-2xl p-[64px] px-4 md:px-[64px] w-full md:w-[790px] h-[509px] relative transition">
          <div className="w-full md:w-[45%]">
            <h2 className="text-3xl font-bold text-white">
              AI판사와 밸런스 재판
            </h2>
            <p className="mt-4 text-sm text-white">
              일상 속 사소한 논쟁이 가장 치열한 토론 배틀이 됩니다.
            </p>
            <p className="text-sm text-white">
              AI판사와 배심원들 앞에서 논리를 증명하고 승리하세요.
            </p>
          </div>

          <Button
            variant="white"
            size="lg"
            className="
              cursor-pointer py-6 w-[45%] rounded-[999px]
              shadow-[0_6px_0_0_rgba(62,116,214,0.7)]
              hover:shadow-[0_8px_0_0_rgba(62,116,214,0.8)]
              active:translate-y-[2px]
              active:shadow-[0_4px_0_0_rgba(62,116,214,0.8)]
              transition-all
            "
            onClick={() => {
              if (accessToken) {
                navigate(PATHS.FIRST_TRIAL);
              } else {
                setShowLoginModal(true);
              }
            }}
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

      {/* HOT 재판 캐러셀 */}
      <section className="bg-main-bright w-full py-4 md:pt-8 md:pb-20">
        {/* 제목 + 전체 재판 보기 버튼 */}
        <div className="flex px-4 md:px-[120px] justify-between items-center p-2 md:pt-10 flex-col md:flex-row gap-4 md:gap-0 text-center md:text-left">
          <h2 className="text-2xl font-bold text-main">
            현재 진행중인 가장 핫한 재판에 참여해보세요
          </h2>
          <Button
            variant="bright_main"
            className="
              cursor-pointer px-[60px] py-[19px] rounded-[999px]
              shadow-[0_6px_0_0_rgba(62,116,214,0.7)]
              hover:shadow-[0_8px_0_0_rgba(62,116,214,0.8)]
              active:translate-y-[2px]
              active:shadow-[0_4px_0_0_rgba(62,116,214,0.8)]
              transition-all
            "
            onClick={() => navigate(PATHS.ONGOING_TRIALS)}
          >
            전체 재판 보기
          </Button>
        </div>

        <p className="px-10 md:px-[120px] text-main-medium pt-4 md:py-0 md:mb-10">
          재판에 참여해서 변론을 작성하고, 당신의 논리를 펼쳐보세요!
          {lastUpdated && (
            <>
              <br />
              <span className="text-sm text-main-medium">{lastUpdated} 기준</span>
            </>
          )}
        </p>

        {/* 카드 4장 보이고, 5번째부터 오른쪽에서 잘리는 캐러셀 */}
        <div className="relative mt-2 md:mt-10">
          {/* 카드 뷰포트: 제목/버튼과 같은 content 폭 */}
          <div className="relative px-10 md:px-[120px]">

            {/* 왼쪽 화살표 (데스크톱만) */}
            <Button
              onClick={handlePrevSingle}
              variant="white"
              disabled={!shouldLoop && startIndex === 0}
              className="hidden md:flex absolute left-[46px] top-1/2 -translate-y-1/2 rounded-full w-13 h-13 z-10 items-center justify-center"
            >
              <Left className="w-6 h-6" title="이전 논쟁" />
            </Button>

            <div className="overflow-hidden w-full" ref={viewportRef}>
              <div
                className="flex"
                style={{
                  transform: `translateX(${translateSingleValue}px)`,
                  gap: `${CARD_GAP}px`,
                  transition: isTransitionEnabled
                    ? `transform ${CAROUSEL_TRANSITION_MS}ms ease`
                    : "none",
                }}
              >
                {carouselItems.map((debate, index) => (
                  <div
                    key={`${debate.id}-${index}`}
                    className="flex-shrink-0"
                    style={{ width: `${Math.max(cardWidth, 0)}px` }}
                  >
                    <HotDebateCard debate={debate} />
                  </div>
                ))}
              </div>
            </div>
            {/* 오른쪽 화살표 (데스크톱만) */}
          <Button
            onClick={handleNextSingle}
            variant="white"
            className="hidden md:flex absolute right-[46px] top-1/2 -translate-y-1/2 rounded-full w-13 h-13 cursor-pointer z-10 items-center justify-center"
          >
            <Right className="w-6 h-6" title="다음 논쟁" />
          </Button>
          </div>

          {/* 페이지네이션 인디케이터 (모바일만) */}
          <div className="flex md:hidden justify-center gap-2 mt-6">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setStartIndex(index)}
                className={`transition-all duration-300 rounded-full
                  ${startIndex % totalSlides === index
                    ? 'w-8 h-2 bg-main'
                    : 'w-2 h-2 bg-main-medium'
                  }`}
                aria-label={`${index + 1}번째 슬라이드로 이동`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 로그인 필요 모달 */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowLoginModal(false)}
          />
          <div className="relative z-10 w-[420px] max-w-[90vw] rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-[20px] font-bold text-main mb-2">
              로그인이 필요합니다
            </h3>
            <p className="text-[16px] text-greyColor-grey700 mb-6">
              밸런스 재판을 시작하려면 먼저 로그인해주세요.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="bright_main"
                className="px-6"
                onClick={() => setShowLoginModal(false)}
              >
                닫기
              </Button>
              <Button
                variant="primary"
                className="px-6"
                onClick={() => {
                  setShowLoginModal(false);
                  navigate(PATHS.LOGIN);
                }}
              >
                로그인하러 가기
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPage;
