import { Route, Routes } from "react-router-dom";
import Main from "@/pages/Main";
import MyPage from "@/pages/MyPage";
import Navbar from "@/components/layout/Navbar";
import Login from "./pages/login/LoginPage";

function App() {
  return (
    <>
      {/* 전역 네브바 */}
      <Navbar />

      {/* 라우팅 영역 */}
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
