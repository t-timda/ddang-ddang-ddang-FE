
import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Main from "@/pages/Main";
import MyPage from "@/pages/MyPage";
import Navbar from "@/components/layout/Navbar";
import Login from "./pages/login/LoginPage";
import ThirdTrialPage from "@/pages/third-trial/ThirdTrialPage";
import FirstTrialPage from "@/pages/FirstTrial/FirstTrialPage";
import NotFound from "@/pages/NotFound";
import { PATHS, PATH_PATTERNS } from "@/constants";
import SecondTrialRegister from "@/pages/SecondTrial/SecondTrialRegister";
import SecondTrial_1 from "@/pages/SecondTrial/SecondTrial_1";
import SecondTrial_final from "@/pages/SecondTrial/SecondTrial_final";
import SignUpPage from "@/pages/SignUp/SignUp";
import VsModePage from "@/pages/VsMode/VsModePage";
import TrialArchive from "@/pages/TrialArchive";
import OngoingTrialList from "@/pages/OngoingTrialList";
import { useSSE } from "@/hooks/notification/useSSE";
import NotificationToast from "@/components/common/NotificationToast";
import UserOngoingList from "@/pages/UserOngoingList";
import { useAuthStore } from "@/stores/useAuthStore";
import { userApi } from "@/apis/user/userApi";

function App() {
  const { pathname } = useLocation();
  const isLogin = useAuthStore((state) => state.isLogin);
  const userId = useAuthStore((state) => state.userId);

  // 페이지 전환 시 항상 스크롤을 상단으로
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // 로그인되어 있지만 userId가 없는 경우 getUserInfo 호출
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (isLogin && userId === null) {
        try {
          const userInfoRes = await userApi.getUserInfo();
          if (userInfoRes.isSuccess && userInfoRes.result) {
            useAuthStore.getState().setLogin({
              accessToken: useAuthStore.getState().accessToken!,
              userId: userInfoRes.result.userId,
              rank: userInfoRes.result.rank,
            });
          }
        } catch (error) {
          console.error('Failed to fetch user info on app init:', error);
        }
      }
    };

    fetchUserInfo();
  }, [isLogin, userId]);

  useSSE(); // SSE 연결

  return (
    <>
      {/* 전역 네브바 */}
      <Navbar />

      {/* 라우팅 영역 */}
      <div className="pt-[98px]">
        <Routes>
        <Route path={PATHS.ROOT} element={<Main />} />
        <Route path={PATHS.MY_PAGE} element={<MyPage />} />
        <Route path={PATHS.LOGIN} element={<Login />} />
        <Route path={PATHS.SIGNUP} element={<SignUpPage />} />

        {/* 1차 재판 (초심) */}
        <Route path={PATH_PATTERNS.firstTrial} element={<FirstTrialPage />} />

        {/* 2차 재판 (항소심) */}
        <Route path={PATH_PATTERNS.secondTrialRegister} element={<SecondTrialRegister />} />
        <Route path={PATH_PATTERNS.secondTrialRoundOne} element={<SecondTrial_1 />} />
        <Route path={PATH_PATTERNS.secondTrialFinal} element={<SecondTrial_final />} />

        {/* 3차 재판 (최종심) */}
        <Route path={PATH_PATTERNS.thirdTrial} element={<ThirdTrialPage />} />

        {/* VS 모드 - 하나의 페이지에서 step으로 관리 */}
        <Route path="/vs-mode" element={<VsModePage />} />

        {/* 재판 아카이브 & 진행중인 재판 */}
        <Route path={PATHS.TRIAL_ARCHIVE} element={<TrialArchive />} />
        <Route path={PATHS.ONGOING_TRIALS} element={<OngoingTrialList />} />
        <Route path={PATHS.USER_ONGOING_TRIALS} element={<UserOngoingList />} />

        <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      {/* 알림 토스트 */}
      <NotificationToast />
    </>
  );
}

export default App;
