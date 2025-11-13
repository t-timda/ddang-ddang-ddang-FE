import { Route, Routes } from "react-router-dom";
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

function App() {
  return (
    <>
      {/* 전역 네브바 */}
      <Navbar />

      {/* 라우팅 영역 */}
      <Routes>
        <Route path={PATHS.ROOT} element={<Main />} />
        <Route path={PATHS.MY_PAGE} element={<MyPage />} />
        <Route path={PATHS.LOGIN} element={<Login />} />
        <Route path={PATHS.SIGNUP} element={<SignUpPage />} />
        <Route path={PATHS.FIRST_TRIAL} element={<FirstTrialPage />} />
        <Route path={PATHS.THIRD_TRIAL} element={<ThirdTrialPage />} />
        <Route path={PATHS.SECOND_TRIAL} element={<SecondTrialRegister />} />
        <Route
          path={PATHS.SECOND_TRIAL_REGISTER}
          element={<SecondTrialRegister />}
        />
        <Route
          path={PATHS.SECOND_TRIAL_ROUND_ONE}
          element={<SecondTrial_1 />}
        />
        <Route
          path={PATHS.SECOND_TRIAL_FINAL}
          element={<SecondTrial_final />}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
