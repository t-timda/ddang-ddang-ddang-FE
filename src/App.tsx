import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Main from "@/pages/Main";
import MyPage from "@/pages/MyPage";
import Navbar from "@/components/layout/Navbar";
import Login from "./pages/login/LoginPage";
import ThirdTrialPage from "@/pages/third-trial/ThirdTrialPage";
import FirstTrialPage from "@/pages/FirstTrial/FirstTrialPage";
import NotFound from "@/pages/NotFound";
import { PATHS } from "@/constants";
import SecondTrialRegister from "@/pages/SecondTrial/SecondTrialRegister";
import SecondTrial_1 from "@/pages/SecondTrial/SecondTrial_1";
import SecondTrial_final from "@/pages/SecondTrial/SecondTrial_final";
import SignUpPage from "@/pages/SignUp/SignUp";
import VsModePage from "@/pages/VsMode/VsModePage";
import TrialArchive from "@/pages/TrialArchive";
import OngoingTrialList from "@/pages/OngoingTrialList";
import { useSSE } from "@/hooks/notification/useSSE";
import NotificationToast from "@/components/common/NotificationToast";

function App() {
  const { pathname } = useLocation();

  // 페이지 전환 시 항상 스크롤을 상단으로
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
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
        <Route path={PATHS.FIRST_TRIAL} element={<FirstTrialPage />} />
        <Route path={PATHS.THIRD_TRIAL} element={<ThirdTrialPage />} />
        <Route path={PATHS.SECOND_TRIAL} element={<SecondTrialRegister />} />
        
        {/* 2차 재판 라우트 (caseId 파라미터 포함) */}
        <Route path={PATHS.SECOND_TRIAL_REGISTER} element={<SecondTrialRegister />} />
        <Route path="/secondtrial/register/:caseId" element={<SecondTrialRegister />} />
        
        <Route path={PATHS.SECOND_TRIAL_ROUND_ONE} element={<SecondTrial_1 />} />
        <Route path="/secondtrial/1/:caseId" element={<SecondTrial_1 />} />
        
        <Route path={PATHS.SECOND_TRIAL_FINAL} element={<SecondTrial_final />} />
        <Route path="/secondtrial/final/:caseId" element={<SecondTrial_final />} />

        {/* VS 모드 - 하나의 페이지에서 step으로 관리 */}
        <Route path="/vs-mode" element={<VsModePage />} />

        {/* 재판 아카이브 & 진행중인 재판 */}
        <Route path={PATHS.TRIAL_ARCHIVE} element={<TrialArchive />} />
        <Route path={PATHS.ONGOING_TRIALS} element={<OngoingTrialList />} />

        <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      {/* 알림 토스트 */}
      <NotificationToast />
    </>
  );
}

export default App;
